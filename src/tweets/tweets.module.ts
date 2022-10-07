import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Tweet, TweetSchema } from './tweet.model';
import { TweetResolver } from './tweets.resolver';
import { TweetsService } from './tweets.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    AuthModule,
  ],
  providers: [TweetResolver, TweetsService],
  // exports: [TweetsService],
})
export class TweetModule {}
