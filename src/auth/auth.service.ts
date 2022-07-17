import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dtos/login.inputs';
import {
  LoggedUserOutput,
  RefreshToken,
  RefreshTokenDocument,
} from './login.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RefreshTokenInput } from './dtos/refreshToken.inputs';
import { isPast } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtTokenService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async generateUserCredentials(user: User): Promise<LoggedUserOutput> {
    const payload = {
      username: user.username,
      name: user.name,
      sub: user._id,
    };

    const refreshToken: RefreshToken = await this.generateRefreshToken(
      user._id,
    );

    return {
      access_token: this.jwtTokenService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(
      loginInput.username,
      loginInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Username or password are invalid`);
    } else {
      return this.generateUserCredentials(user);
    }
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const { userId, refreshToken } = refreshTokenInput;
    const token = await this.refreshTokenModel.findOne({
      $and: [{ userId }, { refreshToken }],
    });
    const user = await this.usersService.getById(new Types.ObjectId(userId));

    if (!token || isPast(token.expiration) || !user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    return this.generateUserCredentials(user);
  }

  async generateRefreshToken(userId): Promise<RefreshToken> {
    function rand() {
      return Math.random().toString(36).substring(2);
    }

    const token = rand() + rand();
    const currentDate = new Date();
    const expirationInDays = 7;

    const newRefreshToken = new this.refreshTokenModel({
      userId: userId,
      expiration: currentDate.setDate(currentDate.getDate() + expirationInDays),
      refreshToken: token,
    });
    await newRefreshToken.save();
    return {
      refreshToken: token,
    };
  }
}
