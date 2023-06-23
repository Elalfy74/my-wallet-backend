import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 225)
  password: string;

  @IsInt()
  @Min(10000000000000, {
    message: 'nationalId must be 14 number',
  })
  @Max(99999999999999, {
    message: 'nationalId must be 14 number',
  })
  nationalId: number;

  @IsInt()
  @Min(1000000000, {
    message: 'phone must be 10 number',
  })
  @Max(1599999999, {
    message: 'phone must be 10 number',
  })
  phone: number;

  @IsUrl()
  @IsOptional()
  avatar: string;
}
