import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private readonly userService;
    constructor(userService: UsersService);
    isAuthenticated: Boolean;
    login(email: string, pswd: string): string;
}
