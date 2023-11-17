import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateAsignacionEstadoDto } from '../dto/create-asignacion_estado.dto';
import { UpdateAsignacionEstadoDto } from '../dto/update-asignacion_estado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignacionEstado } from '../entities/asignacion_estado.entity';
import { In, Repository } from 'typeorm';
import { EstadoService } from 'src/estado/service/estado.service';
import { AsignacionService } from 'src/asignacion/service/asignacion.service';

@Injectable()
export class AsignacionEstadoService {
  private readonly logger = new Logger('EstadoService');

  constructor(
    @InjectRepository(AsignacionEstado)
    private readonly asignacionEstadoRepository: Repository<AsignacionEstado>,
    private readonly estadoService: EstadoService,
    private readonly asignacionService: AsignacionService
  ){}

  async create(createAsignacionEstadoDto: CreateAsignacionEstadoDto) {
    try {
      const asignacionEstado = this.asignacionEstadoRepository.create({
        ...createAsignacionEstadoDto,
        asignacion: await this.asignacionService.findOne(createAsignacionEstadoDto.id_asignacion),
        estado: await this.estadoService.findOne(createAsignacionEstadoDto.id_estado),
        fecha_registro:new Date(),
        registro_activo: true
      });
      await this.asignacionEstadoRepository.save(asignacionEstado);
      return asignacionEstado;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  findAll() {
    return `This action returns all asignacionEstado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asignacionEstado`;
  }

  update(id: number, updateAsignacionEstadoDto: UpdateAsignacionEstadoDto) {
    return `This action updates a #${id} asignacionEstado`;
  }

  remove(id: number) {
    return `This action removes a #${id} asignacionEstado`;
  }

  async noVigentes(id_asignacion: string)
  {
    try {
      await this.asignacionEstadoRepository.createQueryBuilder()
      .update(AsignacionEstado)
      .set({vigente:false})
      .where("id_asignacion = :id_asignacion", { id_asignacion: id_asignacion })
      .execute()
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
