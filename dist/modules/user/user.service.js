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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getUser(id) {
        try {
            const user = await this.userModel.findOne({ _id: id });
            return Object.assign(Object.assign({}, user._doc), { _id: id });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async resetPassword(user, password) {
        if (!user) {
            throw new common_1.BadRequestException({ msg: "Invalid Authentication." });
        }
        if (user.type !== 'register') {
            throw new common_1.BadRequestException({
                msg: `Quick login account with ${user.type} can't use this function.`
            });
        }
        try {
            const passwordHash = await bcrypt.hash(password, 12);
            await this.userModel.findOneAndUpdate({ _id: user._id }, { password: passwordHash });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ msg: error.message });
        }
    }
    async updateUser(user, avatar, name) {
        if (!user) {
            throw new common_1.BadRequestException({ msg: "Invalid Authentication." });
        }
        try {
            await this.userModel.findByIdAndUpdate({ _id: user._id }, {
                avatar, name
            });
            return { msg: "Update Success!" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ msg: error.message });
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map