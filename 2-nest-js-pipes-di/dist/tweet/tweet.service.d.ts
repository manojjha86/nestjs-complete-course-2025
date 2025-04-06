import { UsersService } from 'src/users/users.service';
export declare class TweetService {
    private readonly userServive;
    constructor(userServive: UsersService);
    getTweets(userId: Number): void;
}
