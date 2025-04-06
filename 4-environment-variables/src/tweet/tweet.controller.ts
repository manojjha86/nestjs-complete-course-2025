import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDTO } from './dto/update-tweet.dto';

//http://localhost:3000/tweet

@Controller('tweet')
export class TweetController {
    constructor(private tweetService: TweetService){}

    //http://localhost:3000/tweet/101
    @Get(':userid?')
    public GetTweets(@Param('userid', ParseIntPipe) userid: number){
        return this.tweetService.getTweets(userid);
    }

    @Post()
    public CreateTweet(@Body() tweet: CreateTweetDto){
        return this.tweetService.CreateTweet(tweet);
    }

    @Patch()
    public UpdateTweet(@Body() tweet: UpdateTweetDTO){
        this.tweetService.updateTweet(tweet);
    }

    //DELETE: http:localhost:3000/tweet/3
    @Delete(':id')
    public DeleteTweet(@Param('id', ParseIntPipe) id: number){
        return this.tweetService.deleteTweet(id);
    }
}
