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

@Injectable()
export class ProcesoService {

  private readonly logger = new Logger('ProcesoService')

  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
    private readonly materiaService: MateriaService,
    private readonly defensorService: DefensorService,  
    private readonly asignacionService: AsignacionService,  
      
  ){}

  async create(createProcesoDto: CreateProcesoDto) {
    try {
      const proceso = this.procesoRepository.create({
        ...createProcesoDto,
        materia : await this.materiaService.findOne(createProcesoDto.idMateria),
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.procesoRepository.save(proceso);
      const defensor = await this.defensorService.sorteo(proceso.idCiudad, proceso.materia.id);
      const createAsignacionDto: CreateAsignacionDto = {defensor:defensor,proceso:proceso,fecha:new Date()}
      return this.asignacionService.create(createAsignacionDto)
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Proceso>> {
    return paginate<Proceso>(this.procesoRepository, options, {
      where:{registroActivo:true},
      order: {fechaRegistro: 'DESC'}
    });
  }

  async search(options: IPaginationOptions, searchDto: SearchProcesoDto) {
    const {nurej = "",demandado= "",demandante=""} = searchDto
    return paginate<Proceso>(this.procesoRepository, options, {
      where:    
      [
        { nurej: ILike(`%${nurej}%`),registroActivo:true },
        { demandado: ILike(`%${demandado}%`),registroActivo:true },
        { demandante: ILike(`%${demandante}%`),registroActivo:true },
      ],
      relations:{asignaciones:true},
      order: {fechaRegistro: 'DESC'}
    });
  }

  async all() {
    const proceso = await this.procesoRepository.find({
      where:{registroActivo:true},
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
          registroActivo:true
        }
      }
    );
    if ( !proceso ) throw new NotFoundException(`El permiso con id: ${id} no existe.`);
    return proceso;
  }

  async update(id: string, updateProcesoDto: UpdateProcesoDto) {
    const proceso = await this.procesoRepository.preload({id, ...updateProcesoDto });
    
    if ( !proceso ) throw new NotFoundException(`Proceso con el id: ${id} no existe`);
    if(proceso.registroActivo===false) throw new NotFoundException(`Proceso con el id: ${id} fue dado de baja`);
    try {
      await this.procesoRepository.save(proceso);
      return proceso;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} proceso`;
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
