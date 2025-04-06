import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    getAllUsers(){
        return this.userRepository.find()
    }

    public async createUser(userDto: CreateUserDto){
        //Validate if a user exist with the given email
        const user = await this.userRepository.findOne({
            where: { email: userDto.email}
        })
        //Handle the error / exception
        if(user){
            return 'The user with the given email already exists!';
        }

        //Create that user
        let newUser = this.userRepository.create(userDto);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    }
}