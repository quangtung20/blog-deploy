import { Request, Response } from 'express';
import { INewUser } from 'src/config/interface';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    logout(res: Response): Promise<{
        msg: string;
    }>;
    refreshToken(req: Request): Promise<{
        access_token: string;
        user: import("../../database/schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
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
    facebookLogin(accessToken: string, userId: string, res: Response): Promise<{
        msg: string;
        access_token: string;
        user: {
            password: string;
        };
    }>;
    forgotPassowrd(account: string): Promise<{
        msg: string;
    }>;
}
