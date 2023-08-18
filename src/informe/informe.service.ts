import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateInformeDto } from './dto/create-informe.dto';
import { UpdateInformeDto } from './dto/update-informe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Informe } from './entities/informe.entity';
import { AsignacionService } from 'src/asignacion/asignacion.service';
import { Repository } from 'typeorm';
import { TipoInformeService } from 'src/tipo_informe/tipo_informe.service';

@Injectable()
export class InformeService {

  private readonly logger = new Logger('InformeService')
  constructor(
    @InjectRepository(Informe)
    private readonly informeRepository: Repository<Informe>,
    private readonly asignacionService: AsignacionService,  
    private readonly tipoInformeService: TipoInformeService,  
      
  ){}
  async create(createInformeDto: CreateInformeDto) {
    try {
      const informe = this.informeRepository.create({
        ...createInformeDto,
        asignacion : await this.asignacionService.findOne(createInformeDto.id_asignacion),
        tipo_informe : await this.tipoInformeService.findOne(createInformeDto.id_tipo_informe),
        url: createInformeDto.archivo,
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.informeRepository.save(informe);
      return informe;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const informe = await this.informeRepository.find({
      where:{registro_activo:true},
      relations:{
        tipo_informe:true,
        asignacion: {
          defensor:{persona:true},
          proceso:true
        }
      }
      
  });
    return informe;
  }

  async findForAsignacion(id_asignacion: string) {
    const informe = await this.informeRepository.find({
      where:{
        registro_activo:true,
        asignacion:[{registro_activo:true,id:id_asignacion}]
      },
      relations:{
        tipo_informe:true,
        asignacion: {
          defensor:{persona:true},
          proceso:true
        }
      }
      
  });
    return informe;
  }

  async findForProceso(id_proceso: string) {
    const informe = await this.informeRepository.find({
      where:{
        registro_activo:true,
        asignacion:[{
          registro_activo:true,
          proceso:[{id:id_proceso, registro_activo:true}]
        }]
      },
      relations:{
        tipo_informe:true,
        asignacion: {
          defensor:{persona:true},
          proceso:true
        }
      }
  });
    return informe;
  }

  async findOne(id: string) {
    const informe = await this.informeRepository.findOne({where:{id,registro_activo:true}});
    if ( !informe ) throw new NotFoundException(`El informe con id: ${id} no existe.`);
    return informe;
  }

  async update(id: string, updateInformeDto: UpdateInformeDto) {
    const informe = await this.informeRepository.preload({id, ...updateInformeDto });
    
    if ( !informe ) throw new NotFoundException(`Informe con el id: ${id} no existe`);
    if(informe.registro_activo===false) throw new NotFoundException(`El informe con el id: ${id} fue dado de baja`);
    try {
      informe.asignacion = await this.asignacionService.findOne(updateInformeDto.id_asignacion);
      informe.tipo_informe = await this.tipoInformeService.findOne(updateInformeDto.id_tipo_informe);
      await this.informeRepository.save(informe);
      return informe;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const informe = await this.findOne(id);
    informe.registro_activo=false;
    await this.informeRepository.save(informe)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
