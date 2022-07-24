import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ExtractJwt } from 'passport-jwt';

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
    @Context() ctx,
  ): Promise<LoggedUserOutput> {
    const getToken = ExtractJwt.fromAuthHeaderAsBearerToken();
    const tokenInfo = JSON.parse(
      Buffer.from(getToken(ctx.req).split('.')[1], 'base64').toString(),
    );
    return this.authService.refreshToken(refreshTokenInput, tokenInfo.sub);
  }
}
