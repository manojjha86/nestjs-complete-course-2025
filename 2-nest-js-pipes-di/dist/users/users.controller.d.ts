import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<import("./user.entity").User[]>;
    createUser(user: CreateUserDto): void;
}
