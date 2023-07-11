import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ISession } from 'src/global/interfaces';
import { JwtAuthGuard } from 'src/global/guards';
import { GetUser } from 'src/global/decorators';

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: ISession,
  ) {
    await this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  findAll(@GetUser() user: ISession) {
    return this.transactionsService.findAll(user);
  }
}
