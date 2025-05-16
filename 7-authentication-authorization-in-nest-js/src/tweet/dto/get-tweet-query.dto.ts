import { IntersectionType } from "@nestjs/mapped-types";
import { IsDate, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";

class GetTweetBaseDto{
    @IsOptional()
    @IsDate()
    startdate?: Date;

    @IsOptional()
    @IsDate()
    enddate?: Date;
}

export class GetTweetQueryDto extends IntersectionType(
    GetTweetBaseDto,
    PaginationQueryDto
){

}