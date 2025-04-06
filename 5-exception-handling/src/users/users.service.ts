import { BadRequestException, HttpException, HttpStatus, Injectable, RequestTimeoutException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { error } from "console";
import { UserAlreadyExistsException } from "src/CustomExceptions/user-already-exists.exception";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private readonly configService: ConfigService
    ) { }

    public async getAllUsers() {
        try {
            return await this.userRepository.find({
                relations: {
                    profile: true
                }
            })
        } catch (error) {
            if(error.code === 'ECONNREFUSED'){
                throw new RequestTimeoutException('An error has occured. please try again later', {
                    description: 'Could not connect to the database.'
                })
            }
            console.log(error);
        }
    }

    public async createUser(userDto: CreateUserDto) {
        try {
            //Create a Profile & Save
            userDto.profile = userDto.profile ?? {};

            //CHeck if user with same username / email already exists
            const existingUserWithUsername = await this.userRepository.findOne({
                where: {username: userDto.username}
            })

            if(existingUserWithUsername){
                throw new UserAlreadyExistsException('username', userDto.username);
            }

            const existingUserWithEmail = await this.userRepository.findOne({
                where: {email: userDto.email}
            })

            if(existingUserWithEmail){
                throw new UserAlreadyExistsException('email', userDto.email);
            }

            //Create User Object
            let user = this.userRepository.create(userDto);

            //Save the user object
            return await this.userRepository.save(user);

        } catch (error) {
            if(error.code === 'ECONNREFUSED'){
                throw new RequestTimeoutException('An error has occured. please try again later', {
                    description: 'Could not connect to the database.'
                })
            }
            // if(error.code === '23505'){
            //     throw new BadRequestException('There is some dulicate value for the user in Database');
            // }
            throw error;
        }
    }

    public async deleteUser(id: number) {

        //Delete user
        await this.userRepository.delete(id);

        //Send a response
        return { deleted: true }
    }

    public async FindUserById(id: number) {
        const user =  await this.userRepository.findOneBy({ id })

        if(!user){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'The user with ID ' + id + ' was not found.',
                table: 'user'
            }, HttpStatus.NOT_FOUND, {
                description: 'The exception occured because a user with ID ' +id + ' was not found in users table.'
            })
        }

        return user;
    }
}