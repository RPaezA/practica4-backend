import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { AuthService } from "./auth.service";

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

  @Post("forgot-password")
    async forgotPassword(@Body("email") email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post("reset-password")
    async resetPassword(@Body("token") token: string, @Body("password") password: string) {
        return this.authService.resetPassword(token, password);
    }
}