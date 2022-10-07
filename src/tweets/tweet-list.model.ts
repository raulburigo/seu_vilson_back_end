import { Field, ObjectType } from '@nestjs/graphql';
import { Tweet } from './tweet.model';

@ObjectType()
export class TweetList {
  @Field()
  counter: number;

  @Field(() => [Tweet])
  tweets: Tweet[];
}
