import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class RefreshToken {
  @Field(() => String)
  @Prop()
  refreshToken: string;

  @Prop()
  expiration?: Date;

  @Prop()
  userId?: string;
}

@ObjectType()
export class LoggedUserOutput {
  @Field(() => String, { description: 'Generated access_token of the user' })
  access_token: string;

  @Field(() => RefreshToken)
  refresh_token: RefreshToken;
}
export type RefreshTokenDocument = RefreshToken & Document;

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
