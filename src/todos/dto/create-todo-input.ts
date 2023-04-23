import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  @MinLength(1)
  @MaxLength(400)
  title: string;
}
