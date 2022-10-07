import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class Tweet {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  content: string;

  @Field()
  @Prop({ default: false })
  liked: boolean;
}

export type TweetDocument = Tweet & Document;

export const TweetSchema = SchemaFactory.createForClass(Tweet);
