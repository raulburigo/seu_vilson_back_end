import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Teste {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  counter: number;
}
