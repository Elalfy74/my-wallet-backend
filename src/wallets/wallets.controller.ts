import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ISession } from 'src/auth/interfaces';
import { AuthGuard } from 'src/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateWalletDto, WalletDto } from './dtos';
import { Serialize } from 'src/interceptors';

@Controller('wallets')
@UseGuards(AuthGuard)
@Serialize(WalletDto)
@ApiTags('Wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @Post()
  async create(
    @Body() createWalletDto: CreateWalletDto,
    @Session() session: ISession,
  ) {
    await this.walletsService.create(createWalletDto, session);
    return 'Wallet Created Successfully';
  }

  @Get()
  findOne(@Session() session: ISession) {
    return this.walletsService.findOne(session);
  }
}
