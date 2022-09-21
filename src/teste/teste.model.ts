import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Teste {
  @Field(() => Int)
  counter: string;
}
