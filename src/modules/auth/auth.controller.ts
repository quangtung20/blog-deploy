import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { INewUser } from 'src/config/interface';
import { AuthService } from './auth.service';


@Controller('')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    register(
        @Body() newUserDto: INewUser
    ) {
        return this.authService.register(newUserDto)
    }

    @Post('/active')
    active(
        @Body('active_token') active_token: string
    ) {
        return this.authService.active(active_token)
    }

    @Post('/login')
    login(
        @Body('account') account: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(account, password, res);
    }

    @Get('/logout')
    logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

    @Get('/refresh_token')
    refreshToken(
        @Req() req: Request
    ) {
        return this.authService.refreshToken(req);
    }

    @Post('/google_login')
    googleLogin(
        @Body('id_token') id_token: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.googleLogin(id_token, res)
    }

    @Post('/facebook_login')
    facebookLogin(
        @Body('accessToken') accessToken:string,
        @Body('userID') userId:string,
        @Res({ passthrough: true }) res: Response
    ){
        return this.authService.facebookLogin(accessToken,userId,res)
    }

    @Post('/forgot_password')
    forgotPassowrd(
        @Body('account') account: string
    ) {
        return this.authService.forgotPassword(account)
    }

}
