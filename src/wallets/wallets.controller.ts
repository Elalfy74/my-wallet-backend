import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ISession } from 'src/auth/interfaces';
import { AuthGuard } from 'src/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateWalletDto, FindQueryDto, WalletDto } from './dtos';
import { Serialize } from 'src/interceptors';

@Controller('wallets')
@UseGuards(AuthGuard)
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

  @Get('/one')
  @Serialize(WalletDto)
  findOne(@Session() session: ISession) {
    return this.walletsService.findOne(session);
  }

  @Get()
  find(@Query() query: FindQueryDto, @Session() session: ISession) {
    return this.walletsService.find(query, session);
  }
}
