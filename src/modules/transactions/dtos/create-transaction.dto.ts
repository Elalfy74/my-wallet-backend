import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @Length(5, 15)
  receiverName: string;

  @IsNumber()
  @Min(5)
  @Max(100000)
  amount: number;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  note?: string;
}
