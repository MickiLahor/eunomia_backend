import { Injectable } from '@nestjs/common';
import { SendMailDto } from '../dto/send-mail.dto';
import axios from 'axios';

@Injectable()
export class MailService {

  constructor() {}

  public async sendMail(sendMailDto: SendMailDto) {
    try {
      const url = process.env.MAIL_HOST;
      const data = {
        ...sendMailDto,
        username: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        domain: process.env.MAIL_DOMAIN,
        secret: process.env.MAIL_SECRET
      }
      const headers = {
        'Content-Type': 'application/json'
      }
      const res = await axios.post( url, data, {headers})
      return res.data
    } catch (error) {
      console.log(error);      
    }
  }

}