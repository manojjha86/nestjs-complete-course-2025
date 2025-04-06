import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TweetService } from './tweet.service';

//http://localhost:3000/tweet

@Controller('tweet')
export class TweetController {
    constructor(private tweetService: TweetService){}

    //http://localhost:3000/tweet/101
    @Get(':userid?')
    public GetTweets(@Param('userid', ParseIntPipe) userid: number){
        return this.tweetService.getTweets(userid);
    }
}
