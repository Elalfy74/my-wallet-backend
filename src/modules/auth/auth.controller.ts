import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/global/interceptors';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/global/guards';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dtos';

@Controller('auth')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const savedUser = await this.authService.register(registerDto);

    response.cookie('refreshToken', savedUser.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    return savedUser;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const user = await this.authService.login(loginDto);

    response.cookie('refreshToken', user.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    return user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refreshToken', null, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
  }

  @Get('checkauth')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: { userId: string; email: string }) {
    return user;
  }
}
