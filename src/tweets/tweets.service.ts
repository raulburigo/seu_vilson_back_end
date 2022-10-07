import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Tweet, TweetDocument } from './tweet.model';
import { CreateTweetInput } from './dto/create-tweet-input';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>,
  ) {}

  async create(payload: CreateTweetInput) {
    const createdTweet = new this.tweetModel(payload);
    await createdTweet.save();
    return createdTweet;
  }

  list() {
    return this.tweetModel.find().exec();
  }

  async toggleLike(_id: Types.ObjectId) {
    const tweet = await this.tweetModel.findById(_id).exec();

    tweet.liked = !tweet.liked;
    await tweet.save();
    return tweet;
  }
}
