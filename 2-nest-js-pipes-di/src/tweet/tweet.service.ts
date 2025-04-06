import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetService {
    constructor(private readonly userServive: UsersService) {}

    getTweets(userId: Number){

    }    
}
