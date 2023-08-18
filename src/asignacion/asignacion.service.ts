import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { Asignacion } from './entities/asignacion.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SearchAsignacionDto } from 'src/common/dtos/search.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AsignacionService {

  private readonly logger = new Logger('AsignacionService')


  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    private readonly commonService: CommonService
  ){}

  async findAll(options: IPaginationOptions) {
    let data = await this.paginate(options)
    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    return data;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Asignacion>> {
    return paginate<Asignacion>(this.asignacionRepository, options, {
      where:{registro_activo:true,asignaciones_estados:{vigente:true}},
      relations:{
        defensor:{persona:true},
        proceso:{materia:true},
        excusa:true,
        asignaciones_estados:{estado:true}
      },
      order: {fecha_registro: 'DESC',asignaciones_estados:{fecha_registro:'DESC'}}
    });
  }
  
  async search(options: IPaginationOptions, searchDto: SearchAsignacionDto) {
    const {nurej = "",demandado= "",demandante="", defensor="",materia=""} = searchDto
    let data = await paginate<Asignacion>(this.asignacionRepository, options, {
      where:    
      [
        {
          proceso:[
          { nurej: ILike(`%${nurej}%`),registro_activo:true },
          { demandado: ILike(`%${demandado}%`),registro_activo:true },
          { demandante: ILike(`%${demandante}%`),registro_activo:true },
          {materia:[
            {descripcion: ILike(`%${materia}%`),registro_activo:true}
          ]} 
          ],
        },
        {
            defensor:
            {
              persona:
                {nombre_completo: ILike(`%${defensor}%`),registro_activo:true}
            }
        },
        {
          asignaciones_estados:{vigente:true}
        }        
      ],
      relations:{
        asignaciones_estados:{estado:true},
        defensor:{persona:true},
        proceso:{materia:true}
      },
      order: {fecha_registro: 'DESC',asignaciones_estados:{fecha_registro:'DESC'}}
    });

    for(let i=0;i<data.items.length;i++) {
      data.items[i].proceso.zeus = await this.commonService.getOficinaZeusPro(data.items[i].proceso.id_oficina)
    }
    
    return data; 
  }

  async create(createAsignacionDto: CreateAsignacionDto) {
    try {
      const asignacion = this.asignacionRepository.create({
        ...createAsignacionDto,
        fecha_plazo: new Date(),
        usuario_registro: createAsignacionDto.proceso.usuario_registro,
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.asignacionRepository.save(asignacion);
      
      return asignacion;
    }
    catch(error) {
      console.log(error); 
      this.handleDBExpeptions(error);
    }
  }

  async findOne(id: string) {
    const asignacion = await this.asignacionRepository.findOne(
      {
        where:{
          id,registro_activo:true
        },
        relations:
        {
          proceso:{materia:true,asignaciones:{defensor:true}},
          asignaciones_estados:{estado:true},
          defensor:{persona:true}
        }
      });
    if ( !asignacion ) throw new NotFoundException(`La asignación con id: ${id} no existe.`);
    asignacion.proceso.zeus = await this.commonService.getOficinaZeusPro(asignacion.proceso.id_oficina)
    return asignacion;
  }

  remove(id: number) {
    return `This action removes a #${id} asignacion`;
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
