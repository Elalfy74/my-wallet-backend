import { PickType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class ResetPasswordDto extends PickType(LoginDto, ['password']) {}
