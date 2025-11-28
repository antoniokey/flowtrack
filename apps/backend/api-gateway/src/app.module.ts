import { Module } from '@nestjs/common';

import { FinanceModule } from './finance/finance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FinanceModule, AuthModule],
})
export class AppModule { }
