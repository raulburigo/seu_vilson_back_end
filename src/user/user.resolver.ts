import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

import { User } from './user.model';
import { UserService } from './user.service';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(
    @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  ) {
    return this.userService.getById(_id);
  }

  @Query(() => [User])
  async users(@Args('filters', { nullable: true }) filters?: ListUserInput) {
    return this.userService.list(filters);
  }

  @Mutation(() => User)
  async createUser(@Args('payload') payload: CreateUserInput) {
    return this.userService.create(payload);
  }

  @Mutation(() => User)
  async updateUser(@Args('payload') payload: UpdateUserInput) {
    return this.userService.update(payload);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  ) {
    return this.userService.delete(_id);
  }
}
