import { Model } from "mongoose";
import { UserDocument } from 'src/database/schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getUser(id: any): Promise<any>;
    resetPassword(user: any, password: string): Promise<void>;
    updateUser(user: any, avatar: string, name: string): Promise<{
        msg: string;
    }>;
}
