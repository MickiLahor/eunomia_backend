import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, DataSource, ILike, In, IsNull, Not, QueryBuilder, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { SearchDto } from 'src/common/dtos/search.dto';
import { Defensor } from 'src/defensor/entities/defensor.entity';

@Injectable()
export class PersonaService {
  
  private readonly logger = new Logger('PersonaService')

  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Defensor)
    private readonly defensorRepository: Repository<Defensor>,
  ){}


  async create(createPersonaDto: CreatePersonaDto) {
    try {
      const persona = this.personaRepository.create({
        ...createPersonaDto,
        nombreCompleto: `${createPersonaDto.paterno} ${createPersonaDto.materno} ${createPersonaDto.nombre}`,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.personaRepository.save(persona);
      
      return persona;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Persona>> {
    return paginate<Persona>(this.personaRepository, options, {
      where:{registroActivo:true},
      order: {fechaRegistro: 'DESC'}
      
    });
  }

  async paginateNoDefensor(options: IPaginationOptions): Promise<Pagination<Persona>> {
    const defensor = await this.defensorRepository.find({where:{registroActivo:true,}})

    const ids : string[] = defensor.map(x=>x.persona.id)
    const queryBuilder = await this.personaRepository
    .createQueryBuilder("persona")
    .where("persona.id NOT IN (:...ids)",{ids: ids})
    .andWhere("persona.registroActivo = true")
    return paginate<Persona>(queryBuilder, options);
  }

  async findAll(options: IPaginationOptions) {
  return this.paginate(options)
  }

  async listarNoDefensor(options: IPaginationOptions) {
    return this.paginateNoDefensor(options)
    }

  async search(options: IPaginationOptions, searchDto: SearchDto) {
    const {ci = "",materno= "",nombre="",paterno=""} = searchDto
    return paginate<Persona>(this.personaRepository, options, {
      where:    
      [
        { ci: ILike(`%${ci}%`),registroActivo:true},
        { nombre: ILike(`%${nombre}%`),registroActivo:true},
        { paterno: ILike(`%${paterno}%`),registroActivo:true},
        { materno: ILike(`%${materno}%`),registroActivo:true}
      ],
      order: {fechaRegistro: 'DESC'}
    });
}

  async findOne(id: string) {
    const persona = await this.personaRepository.findOne({where:{id,registroActivo:true}});
    if ( !persona ) throw new NotFoundException(`La Persona con id: ${id} no existe.`);
    return persona;
  }

  async findOneCi(id: string) {
    const persona = await this.personaRepository.findOne({where:{ ci:id,registroActivo:true}});
    if ( !persona ) throw new NotFoundException(`La Persona con id: ${id} no existe.`);

    const defensor = await this.defensorRepository.findOne(
      {
        where:{
          registroActivo:true,
          persona: {
            registroActivo:true,
            id:persona.id
          }
        }
      });      
      if ( defensor ) throw new NotFoundException(`La Persona con ci ${persona.ci} ya es un defensor.`);
      return persona;
  }

  async update(id: string, updatePersonaDto: UpdatePersonaDto) {
    const persona = await this.personaRepository.preload({id, ...updatePersonaDto });
    
    if ( !persona ) throw new NotFoundException(`Persona con el id: ${id} no existe`);
    if(persona.registroActivo===false) throw new NotFoundException(`Persona con el id: ${id} fue dado de baja`);
    try {
      persona.nombreCompleto = `${updatePersonaDto.paterno} ${updatePersonaDto.materno} ${updatePersonaDto.nombre}`;
      await this.personaRepository.save(persona);
      return persona;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const persona = await this.findOne(id);
    persona.registroActivo=false;
    await this.personaRepository.save(persona)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
