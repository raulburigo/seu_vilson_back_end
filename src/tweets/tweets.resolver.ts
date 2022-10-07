import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTweetInput } from './dto/create-tweet-input';
import { Types } from 'mongoose';

import { Tweet } from './tweet.model';
import { TweetsService } from './tweets.service';
import { TweetList } from './tweet-list.model';
// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private tweetsService: TweetsService) {}

  @Query(() => TweetList)
  async tweets(): Promise<TweetList> {
    const list = await this.tweetsService.list();

    return {
      counter: list.length,
      tweets: list,
    };
  }

  @Mutation(() => Tweet)
  async createTweet(
    @Args('payload') payload: CreateTweetInput,
  ): Promise<Tweet> {
    // await sleep(1000);

    return this.tweetsService.create(payload);
  }

  @Mutation(() => Tweet)
  async toggleTweetLike(
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ): Promise<Tweet> {
    // await sleep(1000);

    return this.tweetsService.toggleLike(_id);
  }
}
