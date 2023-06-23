import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISession } from 'src/auth/interfaces';
import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  async create(createTransactionDto: CreateTransactionDto, session: ISession) {
    // Ensure the sender has sufficient funds
    const sender = await this.prisma.wallet.findUnique({
      where: {
        userId: session.userId,
      },
      select: {
        name: true,
        balance: true,
      },
    });

    const formattedBalance = new Decimal(sender.balance.toString()).toNumber();

    if (formattedBalance < createTransactionDto.amount) {
      throw new ForbiddenException('Insufficient funds');
    }

    return this.prisma.$transaction([
      this.prisma.transaction.create({
        data: { ...createTransactionDto, senderName: sender.name },
      }),
      this.prisma.wallet.update({
        data: {
          balance: {
            decrement: createTransactionDto.amount,
          },
        },
        where: {
          name: sender.name,
        },
      }),
      this.prisma.wallet.update({
        data: {
          balance: {
            increment: createTransactionDto.amount,
          },
        },
        where: {
          name: createTransactionDto.receiverName,
        },
      }),
    ]);
  }

  findAll() {
    return `This action returns all transactions`;
  }
}
