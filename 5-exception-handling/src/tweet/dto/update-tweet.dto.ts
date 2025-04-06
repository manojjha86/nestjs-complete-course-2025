import { PartialType } from "@nestjs/mapped-types";
import { CreateTweetDto } from "./create-tweet.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateTweetDTO extends PartialType(CreateTweetDto){
    @IsInt()
    @IsNotEmpty()
    id: number;
}