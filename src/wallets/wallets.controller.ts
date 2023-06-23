import { Controller, Post, Session, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ISession } from 'src/auth/interfaces';
import { AuthGuard } from 'src/guards';
import { ApiTags } from '@nestjs/swagger';

@Controller('wallets')
@UseGuards(AuthGuard)
@ApiTags('Wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @Post()
  async create(@Session() session: ISession) {
    await this.walletsService.create(session);
    return 'Wallet Created Successfully';
  }
}
