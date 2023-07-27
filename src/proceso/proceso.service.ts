import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AsignacionService } from 'src/asignacion/asignacion.service';
import { CreateAsignacionDto } from 'src/asignacion/dto/create-asignacion.dto';
import { SearchProcesoDto } from 'src/common/dtos/search.dto';
import { DefensorService } from 'src/defensor/defensor.service';
import { MateriaService } from 'src/materia/materia.service';
import { ILike, Repository } from 'typeorm';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { UpdateProcesoDto } from './dto/update-proceso.dto';
import { Proceso } from './entities/proceso.entity';
import { ZeusDto, ZeusResponseDto } from 'src/auth/dto/zeus-response.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { AsignacionEstadoService } from 'src/asignacion_estado/asignacion_estado.service';
import { Estado } from 'src/common/enums/enums';
import { EstadoService } from 'src/estado/estado.service';

@Injectable()
export class ProcesoService {

  private readonly logger = new Logger('ProcesoService')

  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
    private readonly materiaService: MateriaService,
    private readonly defensorService: DefensorService,  
    private readonly asignacionService: AsignacionService,  
    private readonly http: AxiosAdapter,
    private readonly configService: ConfigService,  
    private readonly asignacionEstadoService: AsignacionEstadoService,
    private readonly estadoService: EstadoService
  ){}

  async create(createProcesoDto: CreateProcesoDto) {
    try {
      const proceso = this.procesoRepository.create({
        ...createProcesoDto,
        materia : await this.materiaService.findOne(createProcesoDto.id_materia),
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.procesoRepository.save(proceso);
      const defensor = await this.defensorService.sorteo(proceso.id_ciudad, proceso.materia.id);
      const createAsignacionDto: CreateAsignacionDto = {defensor:defensor,proceso:proceso,fecha:new Date()}
      const asignacion = await this.asignacionService.create(createAsignacionDto)
      await this.asignacionEstadoService.create(
        {
          fecha:new Date(),
          id_asignacion:asignacion.id,
          usuario_registro:createProcesoDto.usuario_registro,
          id_estado: (await this.estadoService.findOneDescripcion(Estado.Reasignado)).id
        })
        return asignacion;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Proceso>> {
    return paginate<Proceso>(this.procesoRepository, options, {
      where:{registro_activo:true},
      relations:{asignaciones:{asignaciones_estados:{estado:true}}},
      order: {fecha_registro: 'DESC'}
    });
  }

  async search(options: IPaginationOptions, searchDto: SearchProcesoDto) {
    const {nurej = "",demandado= "",demandante=""} = searchDto
    return paginate<Proceso>(this.procesoRepository, options, {
      where:    
      [
        { nurej: ILike(`%${nurej}%`),registro_activo:true },
        { demandado: ILike(`%${demandado}%`),registro_activo:true },
        { demandante: ILike(`%${demandante}%`),registro_activo:true },
      ],
      relations:{asignaciones:{asignaciones_estados:{estado:true,asignacion:false}}},
      order: {fecha_registro: 'DESC'}
    });
  }

  async all() {
    const proceso = await this.procesoRepository.find({
      where:{registro_activo:true},
      relations:{asignaciones:true,},
  });
  return proceso;
  }


  findAll(options: IPaginationOptions) {
    return this.paginate(options)
  }

  async findOne(id: string) {
    const proceso = await this.procesoRepository.findOne(
      {
        where:{
          id,
          registro_activo:true
        }
      }
    );
    if ( !proceso ) throw new NotFoundException(`El proceso con id: ${id} no existe.`);
    const zeus = await this.getOficinaZeusPro(proceso.id_oficina);
    return {
              id:proceso.id,
              nurej:proceso.nurej,
              demandante: proceso.demandante,
              demandado: proceso.demandado,
              oficina: zeus.descripcion,
              id_oficina: proceso.id_oficina,
              ciudad: zeus.municipio,
              id_ciudad:proceso.id_ciudad,
              ...proceso
   };
  }

  async update(id: string, updateProcesoDto: UpdateProcesoDto) {
    const proceso = await this.procesoRepository.preload({id, ...updateProcesoDto });
    
    if ( !proceso ) throw new NotFoundException(`Proceso con el id: ${id} no existe`);
    if(proceso.registro_activo===false) throw new NotFoundException(`Proceso con el id: ${id} fue dado de baja`);
    try {
      await this.procesoRepository.save(proceso);
      return proceso;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  private async getOficinaZeusPro(idOficina: number) : Promise<ZeusResponseDto>
  {
    const data = await this.http.get<ZeusDto>(`${this.configService.get('URL_ZEUS')}/api/oficina/getOficina/${idOficina}`);
    return {
      ...data,
      id_oficina: data.idOficina,
      id_ente: data.idEnte,
      id_departamento: data.idDepartamento,
      id_municipio: data.idMunicipio,
    };
  }

  async remove(id: string) {
    const proceso = await this.findOne(id);
    proceso.registro_activo=false;
    await this.procesoRepository.save(proceso)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
