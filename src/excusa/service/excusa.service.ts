import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignacionService } from 'src/asignacion/service/asignacion.service';
import { TipoExcusaService } from 'src/tipo-excusa/service/tipo-excusa.service';
import { Repository } from 'typeorm';
import { CreateExcusaDto } from '../dto/create-excusa.dto';
import { UpdateExcusaDto } from '../dto/update-excusa.dto';
import { Excusa } from '../entities/excusa.entity';
import { DefensorService } from 'src/defensor/service/defensor.service';
import { CreateAsignacionDto } from 'src/asignacion/dto/create-asignacion.dto';
import { AsignacionEstadoService } from 'src/asignacion_estado/service/asignacion_estado.service';
import { Estado } from 'src/common/enums/enums';
import { EstadoService } from 'src/estado/service/estado.service';

@Injectable()
export class ExcusaService {
  private readonly logger = new Logger('ExcusaService')
  
  constructor(
    @InjectRepository(Excusa)
    private readonly excusaRepository: Repository<Excusa>,
    private readonly tipoExcusaService: TipoExcusaService,
    private readonly asignacionService: AsignacionService,
    private readonly defensorService: DefensorService,
    private readonly asignacionEstadoService: AsignacionEstadoService,
    private readonly estadoService: EstadoService      
  ){}
  
  async create(createExcusaDto: CreateExcusaDto) {
    try {
      const excusaAsignacion = await this.findForAsignacion(createExcusaDto.id_asignacion)
      if (excusaAsignacion.length === 0) {
        const asignacion = await this.asignacionService.findOne(createExcusaDto.id_asignacion)
        const excusa = await this.excusaRepository.create({
          ...createExcusaDto,
          tipo_excusa: await this.tipoExcusaService.findOne(createExcusaDto.id_tipo_excusa),
          asignacion : asignacion,
          url: createExcusaDto.archivo,
          fecha_registro:new Date(),
          registro_activo: true
        });
        await this.excusaRepository.save(excusa);
        await this.asignacionEstadoService.noVigentes(createExcusaDto.id_asignacion)
        await this.asignacionEstadoService.create(
          {
            id_asignacion:asignacion.id,
            fecha:new Date(),
            vigente:true,
            usuario_registro:excusa.usuario_registro,
            id_estado: (await this.estadoService.findOneDescripcion(Estado.Excusado)).id
          })
        
        const defensor = await this.defensorService.sorteoExcusa(asignacion);

        if(!defensor) return {message:"Todos los defensores se excusaron.", error: true} 

        const createAsignacionDto: CreateAsignacionDto = {defensor:defensor,proceso:asignacion.proceso,fecha:new Date()}
        const nuevaAsignacion = await this.asignacionService.create(createAsignacionDto)
        await this.asignacionEstadoService.create({
          id_asignacion: nuevaAsignacion.id,
          fecha:new Date(),
          vigente:true,
          usuario_registro:excusa.usuario_registro,
          id_estado:(await this.estadoService.findOneDescripcion(Estado.Reasignado)).id
        })
        
        return {...nuevaAsignacion, message:"Registro correcto.", error: false};
      }
      return {message:"Ya existe una excusa registrada por el defensor en el proceso.", error: true};
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const excusa = await this.excusaRepository.find({
      where:{registro_activo:true},
      relations:{
        tipo_excusa:true,
        asignacion: {
          proceso:true
        }
      }
      
  });
    return excusa;
  }

  async findForAsignacion(id_asignacion: string) {  
    const excusa = await this.excusaRepository.find({
      where:{
        registro_activo:true,
        asignacion:[{registro_activo:true,id:id_asignacion}]
      },
      relations:{
        tipo_excusa:true,
        asignacion: {  
          proceso:true,
          defensor:{persona:true}
        }
      }
  });
    return excusa;
  }

  async findForProceso(id_proceso: string) {  
    const excusa = await this.excusaRepository.find({
      where:{
        tipo_excusa:true,
        registro_activo:true,
        asignacion:[{
                    registro_activo:true,
                    proceso:[{id:id_proceso, registro_activo:true}]          
        }]
      },
      relations:{
        asignacion: {  
          proceso:true
        }
      }
  });
    return excusa;
  }

  async findOne(id: string) {
    const excusa = await this.excusaRepository.findOne({where:{id,registro_activo:true}});
    if ( !excusa ) throw new NotFoundException(`La excusa con id: ${id} no existe.`);
    return excusa;
  }

  async update(id: string, updateExcusaDto: UpdateExcusaDto) {
    const excusa = await this.excusaRepository.preload({id, ...updateExcusaDto });
    
    if ( !excusa ) throw new NotFoundException(`Excusa con el id: ${id} no existe`);
    if(excusa.registro_activo===false) throw new NotFoundException(`Tipo Excusa con el id: ${id} fue dado de baja`);
    try {
      excusa.asignacion = await this.asignacionService.findOne(updateExcusaDto.id_asignacion);
      excusa.tipo_excusa = await this.tipoExcusaService.findOne(updateExcusaDto.id_tipo_excusa);
      await this.excusaRepository.save(excusa);
      return excusa;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const excusa = await this.findOne(id);
    excusa.registro_activo=false;
    await this.excusaRepository.save(excusa)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
