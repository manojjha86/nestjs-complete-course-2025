import { Injectable, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { ActiveUserType } from './interfaces/active-user-type.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) 
        private readonly userService: UsersService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly hashinProvider: HashingProvider,
        private readonly jwtService: JwtService
    ){}

    isAuthenticated: Boolean = false;

    public async login(loginDto: LoginDto){
        //1. FIND THE USER WITH USERNAME
        let user = await this.userService.findUserByUsername(loginDto.username);

        //2. IF USER IS AVAILABLE, COMPARE THE PASSWORD
        let isEqual: boolean = false;

        isEqual = await this.hashinProvider.comparePassword(loginDto.password, user.password);

        if(!isEqual){
            throw new UnauthorizedException('Incorrect Password');
        }

        //IF THE PASSWORD MATCH, LOGIN SUCCESS - RETUEN ACCESSTOKEN
        //GENERATE JWT & SEND IT IN THE RESPONSE
        return this.generateToken(user);
        
    }

    public async signup(createUserDto: CreateUserDto){
        return await this.userService.createUser(createUserDto);
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T){
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        });
    }

    private async generateToken(user: User){
        //GENERATE AN ACCESS TOKEN
        const accessToken = await this.signToken<Partial<ActiveUserType>>(user.id, this.authConfiguration.expiresIn, {email: user.email})

        //GENERATE A REFRESH TOKEN
        const refreshToken = await this.signToken(user.id, this.authConfiguration.refreshTokenExpiresIn);

        return { token: accessToken, refreshToken};
    }
}
