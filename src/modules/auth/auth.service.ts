import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from 'src/global/modules/prisma/prisma.service';
import { TokenService } from 'src/global/modules/token/token.service';

import { LoginDto, RegisterDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password } = registerDto;
    // Hash password and register user
    try {
      registerDto.password = await hash(password, 12);

      const user = await this.prisma.user.create({
        data: registerDto,
      });

      const accessToken = this.tokenService.signToken(
        {
          userId: user.id,
          email: user.email,
        },
        'access',
      );

      const refreshToken = this.tokenService.signToken(
        {
          userId: user.id,
          email: user.email,
        },
        'refresh',
      );

      return {
        accessToken,
        refreshToken,
        user,
      };
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

    const accessToken = this.tokenService.signToken(
      {
        userId: user.id,
        email: user.email,
      },
      'access',
    );

    const refreshToken = this.tokenService.signToken(
      {
        userId: user.id,
        email: user.email,
      },
      'refresh',
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
