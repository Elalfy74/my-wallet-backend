import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ISession } from './interfaces';
import { LoginDto, RegisterDto, UserDto } from './dtos';
import { Serialize } from 'src/interceptors';
import { AuthGuard } from 'src/guards';

@Controller('auth')
@ApiTags('Auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Session() session: ISession,
  ) {
    const savedUser = await this.authService.register(registerDto);

    session.userId = savedUser.id;
    session.email = savedUser.email;

    return savedUser;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Session() session: ISession) {
    const user = await this.authService.login(loginDto);

    session.userId = user.id;
    session.email = user.email;

    return user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Session() session: ISession) {
    session.userId = null;
    session.email = null;
  }

  @Get('checkauth')
  @UseGuards(AuthGuard)
  getMe(@Session() session: ISession) {
    return session;
  }
}
