import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CreateTweetInput } from './dto/create-tweet-input';
import { Types } from 'mongoose';

import { Tweet } from './tweet.model';
import { TweetsService } from './tweets.service';
import { TweetList } from './tweet-list.model';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(
    private tweetsService: TweetsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

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
    const newTweet = await this.tweetsService.create(payload);

    this.pubSub.publish('tweetCreated', { tweetCreated: newTweet });

    return newTweet;
  }

  @Mutation(() => Tweet)
  async toggleTweetLike(
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ): Promise<Tweet> {
    // await sleep(1000);

    return this.tweetsService.toggleLike(_id);
  }

  @Subscription(() => Tweet)
  tweetCreated() {
    return this.pubSub.asyncIterator('tweetCreated');
  }
}
