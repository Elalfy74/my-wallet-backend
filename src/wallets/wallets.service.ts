import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Decimal,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { ISession } from 'src/auth/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto } from './dtos';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}
  async create(createWalletDto: CreateWalletDto, session: ISession) {
    try {
      return await this.prisma.wallet.create({
        data: {
          userId: session.userId,
          name: createWalletDto.name,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const msg =
            e.meta?.target === 'name'
              ? 'Name already used'
              : 'User Already has a wallet';
          throw new ForbiddenException(msg);
        }
        if (e.code === 'P2003') {
          throw new UnauthorizedException();
        }
      }
      throw e;
    }
  }

  async findOne(session: ISession) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId: session.userId,
      },
    });
    const formattedBalance = new Decimal(wallet.balance.toString()).toNumber();

    if (!wallet) throw new NotFoundException('No Wallet found');

    return { ...wallet, balance: formattedBalance };
  }
}
