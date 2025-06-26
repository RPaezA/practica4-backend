import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com', // Cambia por tu SMTP
        port: 587,
        auth: {
          user: 'raul.paez@hotmail.com',
          pass: 'Julian@2007',
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
