import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';

@Module({
  controllers: [HashtagController],
  providers: [HashtagService],
  exports: [HashtagService],
  imports: [TypeOrmModule.forFeature([Hashtag])]
})
export class HashtagModule {}
