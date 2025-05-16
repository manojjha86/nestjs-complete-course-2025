import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";
import { Unique } from "typeorm";

export class CreateUserDto{
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @MaxLength(24)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    password: string;

    @IsOptional()
    profile: CreateProfileDto | null;
}