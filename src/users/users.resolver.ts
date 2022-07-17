import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types, Schema as MongooseSchema } from 'mongoose';

import { User } from './user.model';
import { UsersService } from './users.service';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OnlySameUserByIdAllowed } from 'src/auth/users.interceptor';
import { UserId } from './user.decorator';
import { LoggedUserOutput } from 'src/auth/login.model';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@UserId() userId: string) {
    const _id = new Types.ObjectId(userId);
    return this.usersService.getById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async user(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return this.usersService.getById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async users(@Args('filters', { nullable: true }) filters?: ListUserInput) {
    return this.usersService.list(filters);
  }

  @Mutation(() => LoggedUserOutput)
  async createUser(@Args('payload') payload: CreateUserInput) {
    return this.usersService.create(payload);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlySameUserByIdAllowed)
  @Mutation(() => User)
  async updateUser(@Args('payload') payload: UpdateUserInput) {
    return this.usersService.update(payload);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlySameUserByIdAllowed)
  @Mutation(() => User)
  async deleteUser(
    @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  ) {
    return this.usersService.delete(_id);
  }
}
