import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { error } from "console";
import { UserAlreadyExistsException } from "src/CustomExceptions/user-already-exists.exception";
import { PaginationProvider } from "src/common/pagination/pagination.provider";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { Paginated } from "src/common/pagination/paginater.interface";
import { HashingProvider } from "src/auth/provider/hashing.provider";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private readonly configService: ConfigService,
        private readonly paginationProvider: PaginationProvider,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) { }

    public async getAllUsers(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        try {
            return await this.paginationProvider.paginateQuery(
                paginationQueryDto,
                this.userRepository,
                null,
                ['profile']
            )
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
            let user = this.userRepository.create({
                ...userDto,
                password: await this.hashingProvider.hashPassword(userDto.password)
            });

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

    public async findUserByUsername(username: string){
        let user: User | null = null;

        try{
            user =  await this.userRepository.findOneBy({
                username
            })
        }catch(error){
            throw new RequestTimeoutException(error, {
                description: 'User with given username could not be found!'
            })
        }

        if(!user){
            throw new UnauthorizedException('User does not exist!');
        }

        return user;
    }
}