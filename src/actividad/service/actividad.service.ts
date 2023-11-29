import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Actividad } from '../entities/actividad.entity';
import { Repository } from 'typeorm';
import { AsignacionService } from 'src/asignacion/service/asignacion.service';

@Injectable()
export class ActividadService {

  private readonly logger = new Logger('ActividadService')

  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    private readonly asignacionService: AsignacionService,
  ){}

  async create(createActividadDto: CreateActividadDto) {
    try {
      const actividad = this.actividadRepository.create({
        ...createActividadDto,
        asignacion : await this.asignacionService.findOne(createActividadDto.id_asignacion),
        fecha_registro:new Date(),
        registro_activo: true
      });
      await this.actividadRepository.save(actividad);
      return {...actividad, message: "Registro correcto.", error: false};
    }
    catch(error) {
      console.log(error);
      this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const actividad = await this.actividadRepository.find({
      where:{registro_activo:true},
      relations:{
        asignacion: {
          defensor:{persona:true},
          proceso:true
        }
      }
    });
    return actividad;
  }

  findOne(id: number) {
    return `This action returns a #${id} actividad`;
  }

  async update(id: string, updateActividadDto: UpdateActividadDto) {
    const actividad = await this.actividadRepository.preload({id, ...updateActividadDto });
    if ( !actividad ) throw new NotFoundException(`La actividad con el id: ${id} no existe`);
    if(actividad.registro_activo===false) throw new NotFoundException(`La actividad con el id: ${id} fue dado de baja`);
    console.log("🚀 ~ file: actividad.service.ts:60 ~ ActividadService ~ update ~ actividad.finalizado:", actividad.finalizado)
    try {
      await this.actividadRepository.save(actividad);
      return {...actividad, message: 'Actualización correcta.', error: false};
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} actividad`;
  }

  async findByAsignacion(id_asignacion: string) {
    const actividad = await this.actividadRepository.find({
      where: {
        registro_activo:true,
        asignacion: [
          {
            registro_activo: true,
            id:id_asignacion
          }
        ]
      },
      relations:{
        asignacion: {
          defensor: { persona:true },
          proceso: true
        }
      }
    });
    return actividad;
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
