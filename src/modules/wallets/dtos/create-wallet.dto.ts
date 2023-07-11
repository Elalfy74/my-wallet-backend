import { IsString, Length } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @Length(5, 15)
  name: string;
}
