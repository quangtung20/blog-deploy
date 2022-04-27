import * as nodemailer from 'nodemailer';
import { OAuth2Client } from "google-auth-library";
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const configService = new ConfigService()

const CLIENT_ID = `963922917719-2q0s1r675fd2ik0ej10i02i645gipbou.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04ftbTmv-mzRICgYIARAAGAQSNwF-L9IrxnnytNEdhCemVLhPFsuxuDNFiPjZ_iBsumXTMLqDpbFMfSnHw1HkTnkGxA6HTXFie8s`;
const SENDER_MAIL = `kobietdoiten@gmail.com`;

// const CLIENT_ID = ;
// const CLIENT_SECRET = `${configService.get('MAIL_CLIENT_SECRET')}`;
// const REFRESH_TOKEN = `${configService.get('MAIL_REFRESH_TOKEN')}`;
// const SENDER_MAIL = `${configService.get('SENDER_EMAIL_ADDRESS')}`;
// send mail
const sendEmail = async (to: string, url: string, txt: string) => {
    console.log(CLIENT_ID,CLIENT_SECRET, REFRESH_TOKEN,SENDER_MAIL);
    const oAuth2Client = new OAuth2Client(
        CLIENT_ID,
        CLIENT_SECRET,
        OAUTH_PLAYGROUND
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    try {
        const access_token = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: SENDER_MAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
        },
        });

        const mailOptions = {
        from: SENDER_MAIL,
        to: to,
        subject: "BlogDev",
        html: `
                <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the QT Blog.</h2>
                <p>Congratulations! You're almost set to start using QT Blog.
                    Just click the button below to validate your email address.
                </p>
                
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
            
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
            
                <div>${url}</div>
                </div>
                `,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw new InternalServerErrorException(error.message)
    }
    };

export default sendEmail;