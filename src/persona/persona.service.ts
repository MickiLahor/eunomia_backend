import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class PersonaService {
  
  private readonly logger = new Logger('PersonaService')

  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Defensor)
    private readonly defensorRepository: Repository<Defensor>,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService
  ){}


  async create(createPersonaDto: CreatePersonaDto) {
    try {
      const persona = this.personaRepository.create({
        ...createPersonaDto,
        nombre_completo: `${createPersonaDto.paterno} ${createPersonaDto.materno} ${createPersonaDto.nombre}`,
        fecha_registro:new Date(),
        registro_activo: true
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
      where:{registro_activo:true},
      order: {fecha_registro: 'DESC'}
      
    });
  }

  async paginateNoDefensor(options: IPaginationOptions): Promise<Pagination<Persona>> {
    const defensor = await this.defensorRepository.find({where:{registro_activo:true,}})

    const ids : string[] = defensor.map(x=>x.persona.id)
    const queryBuilder = await this.personaRepository
    .createQueryBuilder("persona")
    .where("persona.id NOT IN (:...ids)",{ids: ids})
    .andWhere("persona.registro_activo = true")
    return paginate<Persona>(queryBuilder, options);
  }

  async findAll(options: IPaginationOptions) {
  return this.paginate(options)
  }

  async findAllSeed() {
    const personas = await this.personaRepository.find({
      where:{registro_activo:true}
  });
    return personas;
    }

  async listarNoDefensor(options: IPaginationOptions) {
    return this.paginateNoDefensor(options)
    }

  async search(options: IPaginationOptions, searchDto: SearchDto) {
    const {ci = "",materno= "",nombre="",paterno=""} = searchDto
    return paginate<Persona>(this.personaRepository, options, {
      where:    
      [
        { ci: ILike(`%${ci}%`),registro_activo:true},
        { nombre: ILike(`%${nombre}%`),registro_activo:true},
        { paterno: ILike(`%${paterno}%`),registro_activo:true},
        { materno: ILike(`%${materno}%`),registro_activo:true}
      ],
      order: {fecha_registro: 'DESC'}
    });
  }

  async findOne(id: string) {
    const persona = await this.personaRepository.findOne({where:{id,registro_activo:true}});
    if ( !persona ) throw new NotFoundException(`La Persona con id: ${id} no existe.`);
    return persona;
  }



  async findOneCi(id: string) {
    const persona = await this.personaRepository.findOne({where:{ ci:id,registro_activo:true}});
    if ( !persona ) return  {estado:2,message:`La Persona con CI: ${id} no existe.`}

    const usuario : any = await this.usuarioService.findOneByPersona(persona.ci);
    if(!usuario.estado) return {persona,usuario,estado:3};
      else return {persona,usuario,estado:usuario.estado};
  }

  async update(id: string, updatePersonaDto: UpdatePersonaDto) {
    const persona = await this.personaRepository.preload({id, ...updatePersonaDto });
    
    if ( !persona ) throw new NotFoundException(`Persona con el id: ${id} no existe`);
    if(persona.registro_activo===false) throw new NotFoundException(`Persona con el id: ${id} fue dado de baja`);
    try {
      persona.nombre_completo = `${updatePersonaDto.paterno} ${updatePersonaDto.materno} ${updatePersonaDto.nombre}`;
      await this.personaRepository.save(persona);
      return persona;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const persona = await this.findOne(id);
    persona.registro_activo=false;
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
