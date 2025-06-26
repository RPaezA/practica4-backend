import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  registerUser(@Body() userObj: RegisterAuthDto) {
    return this.authService.register(userObj);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginAuthDto) {
    const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return this.authService.login(user);
  }
  // Cambio: modulo olvido contraseña
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  //Cambio: reset password
  @Post('reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
  return this.authService.resetPassword(resetDto);
}

}