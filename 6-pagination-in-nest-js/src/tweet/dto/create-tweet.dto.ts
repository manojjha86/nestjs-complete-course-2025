import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from "class-validator";

export class CreateTweetDto{
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsOptional()
    image?: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsOptional()
    @IsInt({each: true})
    @IsArray()
    hashtags?: number[]
}