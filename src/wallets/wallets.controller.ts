import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ISession } from 'src/auth/interfaces';
import { JwtGuard } from 'src/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateWalletDto, FindQueryDto, WalletDto } from './dtos';
import { Serialize } from 'src/interceptors';
import { GetUser } from 'src/auth/decrators/get-user.decorator';

@Controller('wallets')
@UseGuards(JwtGuard)
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
  @Serialize(WalletDto)
  findOne(@GetUser() user: ISession) {
    return this.walletsService.findOne(user);
  }

  @Get()
  find(@Query() query: FindQueryDto, @GetUser() user: ISession) {
    return this.walletsService.find(query, user);
  }
}
