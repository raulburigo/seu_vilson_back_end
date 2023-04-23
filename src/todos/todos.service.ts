import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Todo, TodoDocument } from './todo.model';
import { CreateTodoInput } from './dto/create-todo-input';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(payload: CreateTodoInput & { userId: string }) {
    if (payload.title === 'Teste ruim') {
      throw new Error('deu ruim');
    }
    const createdTodo = new this.todoModel(payload);
    await createdTodo.save();
    return createdTodo;
  }

  list(userId: string) {
    return this.todoModel.find({ userId }).exec();
  }

  async toggleDone(_id: Types.ObjectId) {
    const todo = await this.todoModel.findById(_id).exec();

    todo.done = !todo.done;
    await todo.save();
    return todo;
  }

  async deleteTodo(_id: Types.ObjectId) {
    return this.todoModel.findByIdAndDelete(_id).exec();
  }
}
