import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JWT, OAuth2Client } from 'google-auth-library';
import { Model } from "mongoose";
import { INewUser, IUser } from 'src/config/interface';
import sendEmail from 'src/config/sendMail';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import fetch from 'node-fetch';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
    clientUrl = this.configService.get('CLIENT_URL');

    async register(newUserDto: INewUser) {
        try {
            const { name, account, password } = newUserDto;

            const user = await this.userModel.findOne({ account });
            if (user) {
                throw new BadRequestException({ msg: 'Email is already exist' })
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const newUser = {
                name, account, password: passwordHash
            }

            const active_token = await this.jwtService.sign({ newUser }, { expiresIn: '1d' })

            const url = `${this.clientUrl}/active/${active_token}`

            sendEmail(account, url, "verify your email address");
            return {
                msg: 'Success! Please check your email.',
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async active(active_token: string) {
        try {
            const decode = await this.jwtService.verify(active_token);

            const { newUser } = decode;

            if (!newUser) {
                throw new BadRequestException('Invalid authentication.');
            }

            const user = this.userModel.create(newUser);

            return ({ msg: "Account has been activated!" })

        } catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = Object.keys(error.keyValue)[0] + " already exists."
            } else {
                let name = Object.keys(error.errors)[0]
                errMsg = error.errors[`${name}`].message
            }

            throw new InternalServerErrorException({ msg: error.message })
        }
    }

    async login(account: string, password: string, res: Response) {
        try {
            const user:IUser = await this.userModel.findOne({ account });
            if (!user) {
                throw new BadRequestException({ msg: 'This account does not exits.' });
            }
            return this.loginUser(user, password, res);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }

    }

    async loginUser(user:IUser, password: string, res: Response) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestException({ msg: "Password is incorrect." });
        }

        const access_token = await this.jwtService.sign({ id: user._id });
        const refresh_token = await this.jwtService.sign({ id: user._id });


        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: `/api/refresh_token`,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return {
            msg: 'Login Success!',
            access_token,
            user: { ...user._doc, password: '' }
        }
    }

    async logout(res: Response) {
        try {
            res.clearCookie('refreshtoken', { path: '/auth/refresh_token' })
            return { msg: 'Logged out!' };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async refreshToken(req: Request) {
        try {
            const rfToken = req.cookies.refreshtoken;
            if (!rfToken) throw new BadRequestException({ msg: "Please login now!" });

            const decoded = this.jwtService.verify(rfToken);
            if (!decoded.id) {
                throw new BadRequestException({ msg: "Please login now!" })
            }

            const user = await this.userModel.findById(decoded.id).select("-password")
            if (!user) throw new BadRequestException({ msg: "This account does not exist." })

            const access_token = this.jwtService.sign({ id: user._id })
            return { access_token, user }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async googleLogin(id_token: string, res: Response) {
        const verify = await this.client.verifyIdToken({
            idToken: id_token,
            audience: this.configService.get('MAIL_CLIENT_ID')
        });


        const { email, email_verified, name, picture } = verify.getPayload();

        if (!email_verified) {
            throw new BadRequestException({
                msg: 'Email verification failed.'
            });
        }

        const password = email + 'google secrect password';
        const passwordHash = await bcrypt.hash(password, 12);

        const user:IUser = await this.userModel.findOne({ account: email });
        if (user) {
            if (user.type !== 'google') {
                throw new BadRequestException({ msg: 'your account is register before by another method, please try different ways' })
            }
            return this.loginUser(user, password, res)
        } else {
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

    

    async registerUser(user: INewUser, res: Response) {
        const newUser:IUser = await this.userModel.create(user);

        const access_token = await this.jwtService.sign({ id: newUser._id });
        const refresh_token = await this.jwtService.sign({ id: newUser._id });

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: `/api/refresh_token`,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        })

        return ({
            msg: 'Login Success!',
            access_token,
            user: { ...newUser._doc, password: '' }
        })
    }
    async facebookLogin(accessToken:string,userID:string,res:Response){
        try {
            const URL:string = `
              https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}
            `
      
            const data = await fetch(URL)
            .then(res => res.json())
            .then(res => { return res })
      
            const { email, name, picture } = data
      
            const password = email + 'your facebook secrect password'
            const passwordHash = await bcrypt.hash(password, 12)
      
            const user:IUser = await this.userModel.findOne({account: email})
      
            if(user){
              return this.loginUser(user, password, res);
            }else{
              const user = {
                name, 
                account: email, 
                password: passwordHash, 
                avatar: picture.data.url,
                type: 'login'
              }
              return this.registerUser(user, res);
            } 
      
          } catch (error) {
            throw new InternalServerErrorException({msg:error.message});
          }
    }

    async forgotPassword(account:string) {
        try {
            const user = await this.userModel.findOne({ account })
            if (!user) {
                throw new BadRequestException({ msg: 'This account does not exist.' });
            }

            if (user.type !== 'register') {
                throw new BadRequestException({
                    msg: `Quick login account with ${user.type} can't use this function.`
                });
            }
            const access_token = await this.jwtService.sign({ id: user._id });

            const url = `${this.clientUrl}/reset_password/${access_token}`;
            sendEmail(account, url, "verify your email address");

            return { msg: "Success! Please check your email." }

        } catch (error) {
            throw new InternalServerErrorException({ msg: error.message });
        }
    }

}
