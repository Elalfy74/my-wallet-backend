import { ForbiddenException, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import { PrismaService } from 'src/global/modules/prisma/prisma.service';
import { ISession } from 'src/global/interfaces';

import { CreateTransactionDto } from './dtos';

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

  findAll(session: ISession) {
    return this.prisma.wallet.findUnique({
      where: {
        userId: session.userId,
      },
      select: {
        name: true,
        sentTransactions: {
          select: {
            id: true,
            amount: true,
            receiverName: true,
            createdAt: true,
            note: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        receivedTransactions: {
          select: {
            id: true,
            amount: true,
            senderName: true,
            createdAt: true,
            note: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
