import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';
import { AuthModule } from 'src/auth/auth.module';
import { Todo, TodoSchema } from './todo.model';
import { TodoResolver } from './todos.resolver';
import { TodosService } from './todos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    AuthModule,
  ],
  providers: [
    TodoResolver,
    TodosService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  // exports: [TodosService],
})
export class TodoModule {}
