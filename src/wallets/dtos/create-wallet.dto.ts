import { IsString, Length } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @Length(2, 20)
  name: string;
}
