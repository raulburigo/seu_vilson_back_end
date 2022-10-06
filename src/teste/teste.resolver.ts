import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Teste } from './teste.model';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Resolver(() => Teste)
export class TesteResolver {
  //   constructor(private usersService: UsersService) {}

  testeCounter = 0;
  @Query(() => Teste)
  async teste(): Promise<Teste> {
    return {
      id: 'teste-1',
      counter: this.testeCounter,
    };
  }

  @Mutation(() => Teste)
  async addTeste(@Args('counterInput') input: number): Promise<Teste> {
    this.testeCounter = input;

    await sleep(1000);
    return {
      id: 'teste-1',
      counter: this.testeCounter,
    };
  }
}
