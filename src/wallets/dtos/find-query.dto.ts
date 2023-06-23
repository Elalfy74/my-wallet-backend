import { IsString, Length } from 'class-validator';

export class FindQueryDto {
  @IsString()
  @Length(2, 50)
  search: string;
}
