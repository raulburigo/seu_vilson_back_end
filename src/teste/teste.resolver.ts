import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Teste } from './teste.model';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    await sleep(1000);
    return {
      counter: this.testeCounter,
    };
  }
}
