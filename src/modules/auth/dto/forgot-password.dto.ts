import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo no es válido?????' })
  email: string;
}
