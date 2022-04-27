"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const google_auth_library_1 = require("google-auth-library");
const mongoose_2 = require("mongoose");
const sendMail_1 = require("../../config/sendMail");
const user_schema_1 = require("../../database/schemas/user.schema");
const node_fetch_1 = require("node-fetch");
let AuthService = class AuthService {
    constructor(jwtService, configService, userModel) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
        this.client = new google_auth_library_1.OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
        this.clientUrl = this.configService.get('CLIENT_URL');
    }
    async register(newUserDto) {
        try {
            const { name, account, password } = newUserDto;
            const user = await this.userModel.findOne({ account });
            if (user) {
                throw new common_1.BadRequestException({ msg: 'Email is already exist' });
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const newUser = {
                name, account, password: passwordHash
            };
            const active_token = await this.jwtService.sign({ newUser }, { expiresIn: '1d' });
            const url = `${this.clientUrl}/active/${active_token}`;
            (0, sendMail_1.default)(account, url, "verify your email address");
            return {
                msg: 'Success! Please check your email.',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async active(active_token) {
        try {
            const decode = await this.jwtService.verify(active_token);
            const { newUser } = decode;
            if (!newUser) {
                throw new common_1.BadRequestException('Invalid authentication.');
            }
            const user = this.userModel.create(newUser);
            return ({ msg: "Account has been activated!" });
        }
        catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = Object.keys(error.keyValue)[0] + " already exists.";
            }
            else {
                let name = Object.keys(error.errors)[0];
                errMsg = error.errors[`${name}`].message;
            }
            throw new common_1.InternalServerErrorException({ msg: error.message });
        }
    }
    async login(account, password, res) {
        try {
            const user = await this.userModel.findOne({ account });
            if (!user) {
                throw new common_1.BadRequestException({ msg: 'This account does not exits.' });
            }
            return this.loginUser(user, password, res);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async loginUser(user, password, res) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException({ msg: "Password is incorrect." });
        }
        const access_token = await this.jwtService.sign({ id: user._id });
        const refresh_token = await this.jwtService.sign({ id: user._id });
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: `/api/refresh_token`,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return {
            msg: 'Login Success!',
            access_token,
            user: Object.assign(Object.assign({}, user._doc), { password: '' })
        };
    }
    async logout(res) {
        try {
            res.clearCookie('refreshtoken', { path: '/auth/refresh_token' });
            return { msg: 'Logged out!' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async refreshToken(req) {
        try {
            const rfToken = req.cookies.refreshtoken;
            if (!rfToken)
                throw new common_1.BadRequestException({ msg: "Please login now!" });
            const decoded = this.jwtService.verify(rfToken);
            if (!decoded.id) {
                throw new common_1.BadRequestException({ msg: "Please login now!" });
            }
            const user = await this.userModel.findById(decoded.id).select("-password");
            if (!user)
                throw new common_1.BadRequestException({ msg: "This account does not exist." });
            const access_token = this.jwtService.sign({ id: user._id });
            return { access_token, user };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async googleLogin(id_token, res) {
        const verify = await this.client.verifyIdToken({
            idToken: id_token,
            audience: this.configService.get('MAIL_CLIENT_ID')
        });
        const { email, email_verified, name, picture } = verify.getPayload();
        if (!email_verified) {
            throw new common_1.BadRequestException({
                msg: 'Email verification failed.'
            });
        }
        const password = email + 'google secrect password';
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await this.userModel.findOne({ account: email });
        if (user) {
            if (user.type !== 'google') {
                throw new common_1.BadRequestException({ msg: 'your account is register before by another method, please try different ways' });
            }
            return this.loginUser(user, password, res);
        }
        else {
            const user = {
                name,
                account: email,
                password: passwordHash,
                avatar: picture,
                type: 'google'
            };
            return this.registerUser(user, res);
        }
    }
    async registerUser(user, res) {
        const newUser = await this.userModel.create(user);
        const access_token = await this.jwtService.sign({ id: newUser._id });
        const refresh_token = await this.jwtService.sign({ id: newUser._id });
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: `/api/refresh_token`,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return ({
            msg: 'Login Success!',
            access_token,
            user: Object.assign(Object.assign({}, newUser._doc), { password: '' })
        });
    }
    async facebookLogin(accessToken, userID, res) {
        try {
            const URL = `
              https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}
            `;
            const data = await (0, node_fetch_1.default)(URL)
                .then(res => res.json())
                .then(res => { return res; });
            const { email, name, picture } = data;
            const password = email + 'your facebook secrect password';
            const passwordHash = await bcrypt.hash(password, 12);
            const user = await this.userModel.findOne({ account: email });
            if (user) {
                return this.loginUser(user, password, res);
            }
            else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture.data.url,
                    type: 'login'
                };
                return this.registerUser(user, res);
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ msg: error.message });
        }
    }
    async forgotPassword(account) {
        try {
            const user = await this.userModel.findOne({ account });
            if (!user) {
                throw new common_1.BadRequestException({ msg: 'This account does not exist.' });
            }
            if (user.type !== 'register') {
                throw new common_1.BadRequestException({
                    msg: `Quick login account with ${user.type} can't use this function.`
                });
            }
            const access_token = await this.jwtService.sign({ id: user._id });
            const url = `${this.clientUrl}/reset_password/${access_token}`;
            (0, sendMail_1.default)(account, url, "verify your email address");
            return { msg: "Success! Please check your email." };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ msg: error.message });
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map