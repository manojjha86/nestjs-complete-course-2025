import { IsString, IsNotEmpty } from "class-validator";
import { Unique } from "typeorm";

export class CreateHashtagDto{
    @IsNotEmpty()
    @IsString()
    name: string;
}