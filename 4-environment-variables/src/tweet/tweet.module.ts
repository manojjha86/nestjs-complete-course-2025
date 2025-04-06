import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  controllers: [TweetController],
  providers: [TweetService],
  imports: [UsersModule, HashtagModule, TypeOrmModule.forFeature([Tweet])]
})
export class TweetModule {}
