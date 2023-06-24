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

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UserDto } from './dtos';
import { Serialize } from 'src/interceptors';
import { JwtGuard } from 'src/guards';
import { GetUser } from './decrators/get-user.decorator';

@Controller('auth')
@ApiTags('Auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const savedUser = await this.authService.register(registerDto);

    response.cookie('token', savedUser.accessToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    return savedUser.user;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const user = await this.authService.login(loginDto);

    response.cookie('token', user.accessToken);

    return user.user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('token', null);
  }

  @Get('checkauth')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: { userId: string; email: string }) {
    return user;
  }
}
