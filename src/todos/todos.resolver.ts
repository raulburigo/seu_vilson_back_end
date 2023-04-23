import {
  Args,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CreateTodoInput } from './dto/create-todo-input';
import { Types } from 'mongoose';

import { Todo } from './todo.model';
import { TodosService } from './todos.service';
import { Todos } from './todo-list.model';
import {
  ExecutionContext,
  UseGuards,
  createParamDecorator,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req?.user.payload.user_id;
  },
);

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Todos)
  async todos(@UserId() userId: string): Promise<Todos> {
    const list = await this.todosService.list(userId);

    return {
      counter: list.length,
      todoList: list,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Todo)
  async createTodo(
    @UserId() userId: string,
    @Args('payload') payload: CreateTodoInput,
  ): Promise<Todo> {
    const newTodo = await this.todosService.create({
      ...payload,
      userId,
    });

    return newTodo;
  }

  @Mutation(() => Todo)
  async toggleTodoDone(
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ): Promise<Todo> {
    return this.todosService.toggleDone(_id);
  }

  @Mutation(() => Todo)
  async deleteTodo(
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ): Promise<Todo> {
    return this.todosService.deleteTodo(_id);
  }
}
