import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import * as nodemailer from "nodemailer";
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService{
    constructor(
      private jwtService: JwtService,
       @InjectRepository(User) private readonly userRepository: Repository<User>,
       private readonly mailService: MailService){}
    
    login(credenciales: LoginAuthDto){
        let payload={email:"raul.paez6@outlook.com", id:1}
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
     
      //Servicio: olvido contraseña
      async forgotPassword(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new NotFoundException('Usuario no encontrado');
        }
      
        const token = this.jwtService.sign({ id: user.id }, { expiresIn: '15h' });
        const resetLink = `http://localhost:4200/reset-password?token=${token}`;
      
        await this.mailService.sendMail({
          to: email,
          subject: 'Restablecimiento de contraseña',
          text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
        });
      
        return { message: 'Correo de recuperación enviado' };
      }

      async resetPassword(resetDto: ResetPasswordDto) {
        const { token, newPassword } = resetDto;
      
        try {
          const payload = this.jwtService.verify(token);
          const user = await this.userRepository.findOne({ where: { id: payload.id } });
      
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
      
          user.password = await bcrypt.hash(newPassword, 10);
          await this.userRepository.save(user);
      
          return { message: 'Contraseña actualizada correctamente' };
        } catch (error) {
          throw new UnauthorizedException('Token inválido o expirado');
        }
      }
      
      
   
}

