import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { Model } from "mongoose";
import { INewUser, IUser } from 'src/config/interface';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { ShareService } from '../share/share.service';
export declare class AuthService {
    private jwtService;
    private configService;
    private shareService;
    private userModel;
    constructor(jwtService: JwtService, configService: ConfigService, shareService: ShareService, userModel: Model<UserDocument>);
    client: OAuth2Client;
    clientUrl: any;
    register(newUserDto: INewUser): Promise<{
        msg: string;
    }>;
    active(active_token: string): Promise<{
        msg: string;
    }>;
    login(account: string, password: string, res: Response): Promise<{
        msg: string;
        access_token: string;
        user: {
            password: string;
        };
    }>;
    loginUser(user: IUser, password: string, res: Response): Promise<{
        msg: string;
        access_token: string;
        user: {
            password: string;
        };
    }>;
    logout(res: Response): Promise<{
        msg: string;
    }>;
    refreshToken(req: Request): Promise<{
        access_token: string;
        user: User & import("mongoose").Document<any, any, any> & {
            _id: any;
        };
    }>;
    googleLogin(id_token: string, res: Response): Promise<{
        msg: string;
        access_token: string;
        user: {
            password: string;
        };
    }>;
    registerUser(user: INewUser, res: Response): Promise<{
        msg: string;
        access_token: string;
        user: {
            password: string;
        };
    }>;
    facebookLogin(accessToken: string, userID: string, res: Response): Promise<{
        msg: string;
        access_token: string;
        user: {
            password: string;
        };
    }>;
    forgotPassword(account: string): Promise<{
        msg: string;
    }>;
}
