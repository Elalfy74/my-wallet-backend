import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from 'src/global/modules/prisma/prisma.module';
import { TokenModule } from 'src/global/modules/token/token.module';

import { AuthModule } from '../auth/auth.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TokenModule,
    AuthModule,
    WalletsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
