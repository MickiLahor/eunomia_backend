import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateNotificacionDto } from '../dto/create-notificacion.dto';
import { UpdateNotificacionDto } from '../dto/update-notificacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notificacion } from '../entities/notificacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificacionService {

  private readonly logger = new Logger('AsignacionService')


  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ){}


  async create(createNotificacionDto: CreateNotificacionDto) {
    try {
      const notificacion = this.notificacionRepository.create({
        ...createNotificacionDto,
        fecha_registro: new Date(),
        registro_activo: true
      });
      await this.notificacionRepository.save(notificacion)
      return notificacion
    } catch (error) {
      console.log(error); 
      this.handleDBExpeptions(error);
    }
  }

  findAll() {
    return `This action returns all notificacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificacion`;
  }

  update(id: number, updateNotificacionDto: UpdateNotificacionDto) {
    return `This action updates a #${id} notificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificacion`;
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
