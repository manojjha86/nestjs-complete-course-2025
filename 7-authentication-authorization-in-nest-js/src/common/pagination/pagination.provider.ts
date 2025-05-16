import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Repository, ObjectLiteral, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { Paginated } from './paginater.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST) private readonly request: Request
    ){}

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>,
        relations? : string[]
    ): Promise<Paginated<T>>{
        const findOptions: FindManyOptions<T> = {
            skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
            take: paginationQueryDto.limit
        }
        if(where){
            findOptions.where = where;
        }
        if(relations){
            findOptions.relations = relations;
        }

        const result =  await repository.find(findOptions);

        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);
        const currentPage = paginationQueryDto.page;
        const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
        const prevPage = currentPage === 1 ? currentPage : currentPage - 1; 
        const baseUrl = this.request.protocol + '://'+ this.request.headers.host + '/';
        const newUrl = new URL(this.request.url, baseUrl);

        console.log(newUrl);

        const response: Paginated<T> = {
            data: result,
            meta: {
                itemsPerPage: paginationQueryDto.limit,
                totalItems: totalItems,
                currentPage: paginationQueryDto.page,
                totalPages: totalPages
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,
                last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,
                current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${currentPage}`,
                next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
                previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${prevPage}`,
            }
        }

        return response;
    }
}
