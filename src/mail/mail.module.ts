import { Module } from '@nestjs/common';
import { MailService } from './service/mail.service';
import { MailController } from './controller/mail.controller';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
  imports: [
    ConfigModule,
    UsuariosModule
  ],
})
export class MailModule {}
