import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/global/interceptors';
import { ISession } from 'src/global/interfaces';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';

import { WalletsService } from './wallets.service';
import { CreateWalletDto, FindQueryDto, WalletDto } from './dtos';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
@ApiTags('Wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @Post()
  async create(
    @Body() createWalletDto: CreateWalletDto,
    @GetUser() user: ISession,
  ) {
    await this.walletsService.create(createWalletDto, user);
    return 'Wallet Created Successfully';
  }

  @Get('/one')
  @ApiBearerAuth()
  @Serialize(WalletDto)
  findOne(@GetUser() user: ISession) {
    return this.walletsService.findOne(user);
  }

  @Get()
  find(@Query() query: FindQueryDto, @GetUser() user: ISession) {
    return this.walletsService.find(query, user);
  }
}
