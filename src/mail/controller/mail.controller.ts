import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from '../service/mail.service';
import { SendMailDto } from '../dto/send-mail.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  sendMail(@Body() sendMailDto: SendMailDto): any {
    return this.mailService.sendMail(sendMailDto);
  }
  
}
