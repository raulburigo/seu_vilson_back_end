import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Teste } from './teste.model';

@Resolver(() => Teste)
export class TesteResolver {
  //   constructor(private usersService: UsersService) {}

  testeCounter = 0;
  @Query(() => Teste)
  async teste() {
    return {
      counter: this.testeCounter,
    };
  }

  @Mutation(() => Teste)
  async addTeste(@Args('counterInput') input: number) {
    this.testeCounter = input;
    return {
      counter: this.testeCounter,
    };
  }
}
