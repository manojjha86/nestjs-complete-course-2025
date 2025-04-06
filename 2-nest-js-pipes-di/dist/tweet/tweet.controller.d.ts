import { TweetService } from './tweet.service';
export declare class TweetController {
    private tweetService;
    constructor(tweetService: TweetService);
    GetTweets(userid: number): void;
}
