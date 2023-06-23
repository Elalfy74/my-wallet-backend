import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ISession } from 'src/auth/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}
  async create(session: ISession) {
    try {
      return await this.prisma.wallet.create({
        data: {
          userId: session.userId,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('User Already have a wallet');
        }
        if (e.code === 'P2003') {
          throw new UnauthorizedException();
        }
      }
      throw e;
    }
  }
}
