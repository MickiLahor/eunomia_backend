import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from '../service/mail.service';
import { SendMailDto } from '../dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  sendMail(@Body() sendMailDto: SendMailDto): any {
    return this.mailService.sendMail(sendMailDto);
  }
  
}
