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
import { JwtGuard } from 'src/guards';
import { ISession } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decrators/get-user.decorator';

@Controller('transactions')
@UseGuards(JwtGuard)
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
