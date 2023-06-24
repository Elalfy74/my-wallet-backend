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
import { CreateWalletDto, FindQueryDto } from './dtos';

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
            e.meta?.target[0] === 'name'
              ? 'Wallet Name is already taken'
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

    if (!wallet) throw new NotFoundException('No Wallet found');

    const formattedBalance = new Decimal(wallet.balance.toString()).toNumber();

    return { ...wallet, balance: formattedBalance };
  }

  find(query: FindQueryDto, session: ISession) {
    const q = { name: { contains: query.search, mode: 'insensitive' } };
    const filter = query.search ? q : {};

    console.log(filter);

    return this.prisma.wallet.findMany({
      where: {
        ...filter,

        AND: {
          userId: {
            not: {
              equals: session.userId,
            },
          },
        },
      },
      select: {
        name: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      take: 4,
    });
  }
}
