import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "src/auth/auth.module";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "src/profile/profile.entity";
import { PaginationModule } from "src/common/pagination/pagination.module";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [
        PaginationModule, 
        TypeOrmModule.forFeature([User, Profile]),
        forwardRef(() => AuthModule)
    ]
})
export class UsersModule{
}