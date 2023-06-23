import { Expose } from 'class-transformer';

export class WalletDto {
  @Expose()
  name: string;

  @Expose()
  balance: number;
}
