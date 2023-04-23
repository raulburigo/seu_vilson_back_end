import { Field, ObjectType } from '@nestjs/graphql';
import { Todo } from './todo.model';

type TodoList = Todo[];

@ObjectType()
export class Todos {
  @Field()
  counter: number;

  @Field(() => [Todo])
  todoList: TodoList;
}
