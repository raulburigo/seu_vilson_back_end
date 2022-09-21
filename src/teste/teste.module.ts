import { Module } from '@nestjs/common';

import { TesteResolver } from './teste.resolver';

@Module({
  imports: [],
  providers: [TesteResolver],
})
export class TesteModule {}
