import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { password } = registerDto;
    // Hash password and register user
    try {
      registerDto.password = await hash(password, 12);

      return await this.prisma.user.create({
        data: registerDto,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            `${e.meta?.target} is already registered!`,
          );
        }
      }
      throw e;
    }
  }

  async login({ email, password: hash }: LoginDto) {
    // Check email
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid Email or Password');

    // Check Password
    const isEqual = await compare(hash, user.password);
    if (!isEqual) throw new UnauthorizedException('Invalid Email or Password');

    return user;
  }
}
