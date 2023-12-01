import { Module } from '@nestjs/common';
import { MailService } from './service/mail.service';
import { MailController } from './controller/mail.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
  imports: [ConfigModule],
})
export class MailModule {}
