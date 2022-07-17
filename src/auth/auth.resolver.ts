import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LoggedUserOutput } from 'src/auth/login.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/login.inputs';
import { RefreshTokenInput } from './dtos/refreshToken.inputs';

@Resolver(() => LoggedUserOutput)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoggedUserOutput)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => LoggedUserOutput)
  refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ) {
    return this.authService.refreshToken(refreshTokenInput);
  }
}
