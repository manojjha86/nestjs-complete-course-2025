import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDTO } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

//http://localhost:3000/tweet

@Controller('tweet')
export class TweetController {
    constructor(private tweetService: TweetService){}

    //http://localhost:3000/tweet/101?limit=10&page=3
    @Get(':userid?')
    public GetTweets(
        @Param('userid', ParseIntPipe) userid: number,
        @Query() paginationQueryDto: PaginationQueryDto
    ){
        console.log(paginationQueryDto);
        return this.tweetService.getTweets(userid, paginationQueryDto);
    }

    @Post()
    public CreateTweet(@Body() tweet: CreateTweetDto, @ActiveUser('sub') userId: number){
        return this.tweetService.CreateTweet(tweet, userId);
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
