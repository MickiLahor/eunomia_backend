import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { Asignacion } from './entities/asignacion.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SearchAsignacionDto } from 'src/common/dtos/search.dto';

@Injectable()
export class AsignacionService {

  private readonly logger = new Logger('AsignacionService')


  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
  ){}

  async findAll(options: IPaginationOptions) {
    return this.paginate(options)
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Asignacion>> {
    return paginate<Asignacion>(this.asignacionRepository, options, {
      where:{registro_activo:true},
      relations:{
        defensor:true,
        proceso:true,
        excusa:true
      },
      order: {fecha_registro: 'DESC'}
    });
  }
  
  async search(options: IPaginationOptions, searchDto: SearchAsignacionDto) {
    const {nurej = "",demandado= "",demandante="", defensor="",materia=""} = searchDto
    return paginate<Asignacion>(this.asignacionRepository, options, {
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
        }      
      ],
      relations:{asignaciones_estados:{estado:true},defensor:true,proceso:{materia:true}},
      order: {fecha_registro: 'DESC'}
    });
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
          proceso:true,
          asignaciones_estados:true
        }
      });
    if ( !asignacion ) throw new NotFoundException(`La asignación con id: ${id} no existe.`);
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
