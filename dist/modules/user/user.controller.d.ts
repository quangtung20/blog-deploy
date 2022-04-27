import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: string): Promise<any>;
    resetPassword(user: any, password: string): Promise<void>;
    updateUser(user: any, avatar: string, name: string): Promise<{
        msg: string;
    }>;
}
