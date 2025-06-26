import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

import { MailModule } from '../mail/mail.module';

@Module({
    imports:[JwtModule.register({
        secret:"CODIGO_SECRETO",
        signOptions:{expiresIn: '12h'}
    }), TypeOrmModule.forFeature([User]),MailModule],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy],
    
    
})
export class AuthModule {}



