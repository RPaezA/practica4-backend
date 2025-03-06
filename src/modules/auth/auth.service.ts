import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import * as nodemailer from "nodemailer";

@Injectable()
export class AuthService{
    constructor(private jwtService: JwtService, @InjectRepository(User) private readonly userRepository: Repository<User>){}
    
    login(credenciales: LoginAuthDto){
        let payload={email:"raul.paez@outlook.com", id:1}
        const token= this.jwtService.sign(payload)
        return {token:token}; 
    }

    async register(userData: { email: string; password: string; name:string }) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = this.userRepository.create({...userData, password: hashedPassword});
        await this.userRepository.save(newUser);
        return { message: 'Usuario registrado', user: { email: newUser.email } };
        
      }
    
      async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
          return user;
        }
        return null;
      }
    
      generateJwt(user: User) {
        const payload = { username: user.name, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

   // 🔹 Método para solicitar restablecimiento de contraseña
   async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
        throw new NotFoundException('No se encontró un usuario con este correo.');
    }

    // Generar un token válido por 1 hora
    const resetToken = this.jwtService.sign(
      { email: user.email },
      { expiresIn: "1h" }
  );

  // Enviar correo al usuario con el token
  await this.sendResetPasswordEmail(user.email, resetToken);

  return { message: "Se ha enviado un correo con instrucciones para restablecer la contraseña." };
}
// 🔹 Método para restablecer la contraseña
async resetPassword(token: string, newPassword: string) {
  try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({ where: { email: payload.email } });

      if (!user) {
          throw new NotFoundException("Usuario no encontrado.");
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);

      return { message: "Contraseña actualizada exitosamente." };
  } catch (error) {
      throw new BadRequestException("Token inválido o expirado.");
  }
}
  // 🔹 Método para enviar el correo con el enlace de recuperación
  private async sendResetPasswordEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "tuemail@gmail.com", // Reemplázalo con tu correo
            pass: "tucontraseña",     // Reemplázalo con tu contraseña
        },
    });

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    await transporter.sendMail({
        from: '"Soporte" <soporte@tudominio.com>',
        to: email,
        subject: "Recuperación de contraseña",
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
               <a href="${resetLink}">Restablecer contraseña</a>`,
    });
}
}

