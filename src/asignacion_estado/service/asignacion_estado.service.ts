import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEstadoDefensorDto, CreateAsignacionEstadoDto } from '../dto/create-asignacion_estado.dto';
import { UpdateAsignacionEstadoDto } from '../dto/update-asignacion_estado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignacionEstado } from '../entities/asignacion_estado.entity';
import { In, Repository } from 'typeorm';
import { EstadoService } from 'src/estado/service/estado.service';
import { AsignacionService } from 'src/asignacion/service/asignacion.service';
import { Estado } from 'src/common/enums/enums';

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

  async apersonamientoDefensor(createApersonamientoDefensorDto: CreateEstadoDefensorDto) {
    try {
      const apersonado = await this.asignacionEstadoRepository.find({
        where: {
          asignacion: {id: createApersonamientoDefensorDto.id_asignacion},
          estado: {id: (await this.estadoService.findOneDescripcion(Estado.Apersonado)).id}
        }
      })
      const excusado = await this.asignacionEstadoRepository.find({
        where: {
          asignacion: {id: createApersonamientoDefensorDto.id_asignacion},
          estado: {id: (await this.estadoService.findOneDescripcion(Estado.Excusado)).id}
        }
      })
      if (apersonado.length === 0) {
        if (excusado.length === 0) {
          const anteriorEstado = await this.findOneByAsignacion(createApersonamientoDefensorDto.id_asignacion)
          if (anteriorEstado !== null) {
            anteriorEstado.vigente = false
            await this.asignacionEstadoRepository.save(anteriorEstado);
          }
          const asignacionEstado = await this.create({
            id_asignacion: createApersonamientoDefensorDto.id_asignacion,
            fecha: createApersonamientoDefensorDto.fecha,
            vigente: true,
            usuario_registro: createApersonamientoDefensorDto.usuario_registro,
            id_estado: (await this.estadoService.findOneDescripcion(Estado.Apersonado)).id
          })
          const asignacionApersonamiento = await this.asignacionService.findOne(asignacionEstado.asignacion.id)
          return {...asignacionApersonamiento, message:"Apersonamiento de defensor registrado correctamente", error: false};
        }
        return {message:"No se puede registrar apersonamiento de un defensor excusado.", error: true, print: false};
      }
      const asignacionApersonamientoReg = await this.asignacionService.findOne(createApersonamientoDefensorDto.id_asignacion)
      return {...asignacionApersonamientoReg, message:"Ya existe un apersonamiento del defensor registrado en el proceso.", error: true, print: true};
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async conclusionDefensor(createConclusionDefensorDto: CreateEstadoDefensorDto) {
    try {
      const concluido = await this.asignacionEstadoRepository.find({
        where: {
          asignacion: {id: createConclusionDefensorDto.id_asignacion},
          estado: {id: (await this.estadoService.findOneDescripcion(Estado.Concluido)).id}
        }
      })
      const excusado = await this.asignacionEstadoRepository.find({
        where: {
          asignacion: {id: createConclusionDefensorDto.id_asignacion},
          estado: {id: (await this.estadoService.findOneDescripcion(Estado.Excusado)).id}
        }
      })
      if (concluido.length === 0) {
        if (excusado.length === 0) {
          const anteriorEstado = await this.findOneByAsignacion(createConclusionDefensorDto.id_asignacion)
          if (anteriorEstado !== null) {
            anteriorEstado.vigente = false
            await this.asignacionEstadoRepository.save(anteriorEstado);
          }
          const asignacionEstado = await this.create({
            id_asignacion: createConclusionDefensorDto.id_asignacion,
            fecha: createConclusionDefensorDto.fecha,
            vigente: true,
            usuario_registro: createConclusionDefensorDto.usuario_registro,
            id_estado: (await this.estadoService.findOneDescripcion(Estado.Concluido)).id
          })
          const asignacionApersonamiento = await this.asignacionService.findOne(asignacionEstado.asignacion.id)
          return {...asignacionApersonamiento, message:"Conclusión del defensor en el proceso registrada correctamente", error: false};
        }
        return {message:"No se puede registrar la conclusión de un defensor excusado.", error: true, print: false};
      }
      const asignacionApersonamientoReg = await this.asignacionService.findOne(createConclusionDefensorDto.id_asignacion)
      return {...asignacionApersonamientoReg, message:"Ya existe la conclusión del defensor registrada en el proceso.", error: true, print: true};
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  findAll() {
    return `This action returns all asignacionEstado`;
  }

  async findOne(id: string) {
    const asignacionEstado = await this.asignacionEstadoRepository.findOne(
      {
        where:{
          id,
          registro_activo: true,
        }
      }
    );
    return asignacionEstado;
  }

  async findOneByAsignacion(id: string) {
    const asignacionEstado = await this.asignacionEstadoRepository.findOne(
      {
        where:{
          asignacion: { id: id },
          registro_activo: true,
          vigente: true
        }
      }
    );
    return asignacionEstado;
  }

  async update(id: string, updateAsignacionEstadoDto: UpdateAsignacionEstadoDto) {
    const asignacionEstado = await this.asignacionEstadoRepository.preload({id, ...updateAsignacionEstadoDto });
    
    if ( !asignacionEstado ) throw new NotFoundException(`Proceso con el id: ${id} no existe`);
    if(asignacionEstado.registro_activo===false) throw new NotFoundException(`Proceso con el id: ${id} fue dado de baja`);
    try {
      await this.asignacionEstadoRepository.save(asignacionEstado);
      return asignacionEstado;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
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
