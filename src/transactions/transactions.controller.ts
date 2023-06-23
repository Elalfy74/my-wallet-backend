import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Session,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos';
import { AuthGuard } from 'src/guards';
import { ISession } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@UseGuards(AuthGuard)
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Session() session: ISession,
  ) {
    await this.transactionsService.create(createTransactionDto, session);
  }

  @Get()
  findAll(@Session() Session: ISession) {
    return this.transactionsService.findAll(Session);
  }
}
