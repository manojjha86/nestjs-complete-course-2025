import { Injectable, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDTO } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { skip } from 'node:test';
import { take } from 'rxjs';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/paginater.interface';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UsersService, 
        private readonly hashtagService: HashtagService,
        @InjectRepository(Tweet) private readonly tweetRepository: Repository<Tweet>,
        private readonly paginationProvider: PaginationProvider
    ) {}

    public async getTweets(userId: number, pageQueryDto: PaginationQueryDto): Promise<Paginated<Tweet>>{
        //Find user with the given userid from user table
        const user = await this.userService.FindUserById(userId);

        if(!user){
            throw new NotFoundException(`User with userId ${userId} is not found!`);
        }

        return await this.paginationProvider.paginateQuery(
            pageQueryDto,
            this.tweetRepository,
            { user: { id: userId}}
        )
    }  
    
    public async CreateTweet(createTweetDto: CreateTweetDto){
        //Find user with the given userid from user table
        let user = await this.userService.FindUserById(createTweetDto.userId);

        //Fetch all the hastags based on hastag array
        let hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags)

        //Create a tweet
        let tweet = await this.tweetRepository.create({...createTweetDto, user, hashtags})

        //Save the tweet
        return await this.tweetRepository.save(tweet);
    }

    
    public async updateTweet(updateTweetDto: UpdateTweetDTO){
        //Find all hashtags
        let hashtags = await this.hashtagService.findHashtags(updateTweetDto.hashtags);

        //Find the tweet by Id
        let tweet = await this.tweetRepository.findOneBy({id: updateTweetDto.id});

        //Update properties of the tweet
        tweet.text = updateTweetDto.text ?? tweet.text;
        tweet.image = updateTweetDto.image ?? tweet.image;
        tweet.hashtags = hashtags;

        //Save the tweet
        return await this.tweetRepository.save(tweet);
    }

    
    public async deleteTweet(id: number){
        await this.tweetRepository.delete({
            id
        })

        return { deleted: true, id}
    }
}
