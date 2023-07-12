import { IsJWT, IsUUID } from 'class-validator';

export class ResetPasswordParamsDto {
  @IsUUID()
  userId: string;

  @IsJWT()
  token: string;
}
