import { Injectable } from '@nestjs/common';
import { SendMailDto } from '../dto/send-mail.dto';
import axios from 'axios';

@Injectable()
export class MailService {

  constructor() {}

  public async sendMail(sendMailDto: SendMailDto) {
    try {
      const url = process.env.HOST_MAIL;
      const data = sendMailDto
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