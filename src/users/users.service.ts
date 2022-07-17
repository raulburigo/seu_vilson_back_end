import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './user.model';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs';
import { AuthService } from 'src/auth/auth.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(payload: CreateUserInput) {
    const { password, username } = payload;
    const userWithSameUsername = await this.findByUsername(username);

    if (userWithSameUsername) {
      throw new GraphQLError('Username already in use');
    }
    const saltOrRounds = 10;
    payload.password = await bcrypt.hash(password, saltOrRounds);

    const createdUser = new this.userModel(payload);
    await createdUser.save();
    return this.authService.login({ password, username });
  }

  getById(_id: Types.ObjectId) {
    return this.userModel.findById(_id).exec();
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  list(filters: ListUserInput) {
    return this.userModel.find({ ...filters }).exec();
  }

  update(payload: UpdateUserInput) {
    return this.userModel
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec();
  }

  delete(_id: MongooseSchema.Types.ObjectId) {
    return this.userModel.findByIdAndDelete(_id).exec();
  }
}
