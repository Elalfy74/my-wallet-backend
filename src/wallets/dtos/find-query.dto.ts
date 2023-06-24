import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FindQueryDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  search: string;
}
