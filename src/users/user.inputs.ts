import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  @MaxLength(200)
  @MinLength(4)
  username: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class ListUserInput {
  @Field(() => ID, { nullable: true })
  _id?: MongooseSchema.Types.ObjectId;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  username?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}
