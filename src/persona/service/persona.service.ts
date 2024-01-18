import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreatePersonaDto } from '../dto/create-persona.dto';
import { UpdatePersonaDto } from '../dto/update-persona.dto';
import { Persona } from '../entities/persona.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { SearchDto } from 'src/common/dtos/search.dto';
import { Defensor } from 'src/defensor/entities/defensor.entity';
import { UsuariosService } from 'src/usuarios/service/usuarios.service';
import { CommonService } from 'src/common/common.service';
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
    private readonly usuarioService: UsuariosService,
    @Inject(forwardRef(() => CommonService))
    private readonly commonService: CommonService
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
    const {ci = "", nombre= "", materno= "", paterno=""} = searchDto
    let persona = await paginate<Persona>(this.personaRepository, options, {
      where: [
        { ci: ILike(`%${ci}%`)},
        { nombre: ILike(`%${nombre}%`)},
        { paterno: ILike(`%${paterno}%`)},
        { materno: ILike(`%${materno}%`)}
      ],
      relations: {
        usuario: { roles: true },
        defensor: { materia: true }
      },
      order: {fecha_registro: 'DESC'}
    });
    
    if (persona.items.length !== 0) {
      let zeus = null
      for (let i = 0; i < persona.items.length; i++) {
        if (persona.items[i].usuario.id_oficina != null) {
          zeus = await this.commonService.getOficinaZeusPro(persona.items[i].usuario.id_oficina)
          persona.items[i] = Object.assign(persona.items[i], {zeus});
        } else {
          const zeus = {id_departamento: null, departamento: null, id_municipio: null, municipio: null}
          const departamentos = await this.commonService.getDepartamentoZeusPro()
          const municipios = await this.commonService.getMunicipioZeusPro(persona.items[i].usuario.id_departamento)
          const departamento = departamentos.find((dep) => dep.id_departamento === persona.items[i].usuario.id_departamento)
          const municipio = municipios.find((mun) => mun.id_municipio === persona.items[i].usuario.id_ciudad)
          zeus.id_departamento = departamento.id_departamento
          zeus.departamento = departamento.descripcion
          zeus.id_municipio = municipio.id_municipio
          zeus.municipio = municipio.descripcion
          persona.items[i] = Object.assign(persona.items[i], {zeus});
        }
      }
    }
    return persona
  }

  async searchDepartamento(options: IPaginationOptions, searchDto: SearchDto) {
    const {ci = "", nombre= "", materno= "", paterno="", id_departamento=0} = searchDto
    let persona = await paginate<Persona>(this.personaRepository, options, {
      where: [
        { ci: ILike(`%${ci}%`), usuario: {id_departamento: id_departamento} },
        { nombre: ILike(`%${nombre}%`), usuario: {id_departamento: id_departamento} },
        { paterno: ILike(`%${paterno}%`), usuario: {id_departamento: id_departamento} },
        { materno: ILike(`%${materno}%`), usuario: {id_departamento: id_departamento} }
      ],
      relations: {
        usuario: { roles: true },
        defensor: { materia: true }
      },
      order: {fecha_registro: 'DESC'}
    });
    
    if (persona.items.length !== 0) {
      let zeus = null
      for (let i = 0; i < persona.items.length; i++) {
        if (persona.items[i].usuario.id_oficina != null) {
          zeus = await this.commonService.getOficinaZeusPro(persona.items[i].usuario.id_oficina)
          persona.items[i] = Object.assign(persona.items[i], {zeus});
        } else {
          const zeus = {id_departamento: null, departamento: null, id_municipio: null, municipio: null}
          const departamentos = await this.commonService.getDepartamentoZeusPro()
          const municipios = await this.commonService.getMunicipioZeusPro(persona.items[i].usuario.id_departamento)
          const departamento = departamentos.find((dep) => dep.id_departamento === persona.items[i].usuario.id_departamento)
          const municipio = municipios.find((mun) => mun.id_municipio === persona.items[i].usuario.id_ciudad)
          zeus.id_departamento = departamento.id_departamento
          zeus.departamento = departamento.descripcion
          zeus.id_municipio = municipio.id_municipio
          zeus.municipio = municipio.descripcion
          persona.items[i] = Object.assign(persona.items[i], {zeus});
        }
      }
    }
    return persona
  }

  async findOne(id: string) {
    let persona = await this.personaRepository.findOne(
      {
        // where: {id,registro_activo:true},
        where: {id},
        relations:{usuario: {roles: true}, defensor: {materia: true}}
      }
    );
    if ( !persona ) {
      throw new NotFoundException(`La Persona con id: ${id} no existe.`);
    } else {
      if (persona.usuario.id_oficina !== null) {
        const zeus = await this.commonService.getOficinaZeusPro(persona.usuario.id_oficina)
        persona = Object.assign(persona, {zeus});
      } else {
        const zeus = {id_departamento: null, departamento: null, id_municipio: null, municipio: null}
        const departamentos = await this.commonService.getDepartamentoZeusPro()
        const municipios = await this.commonService.getMunicipioZeusPro(persona.usuario.id_departamento)
        const departamento = departamentos.find((dep) => dep.id_departamento === persona.usuario.id_departamento)
        const municipio = municipios.find((mun) => mun.id_municipio === persona.usuario.id_ciudad)
        zeus.id_departamento = departamento.id_departamento
        zeus.departamento = departamento.descripcion
        zeus.id_municipio = municipio.id_municipio
        zeus.municipio = municipio.descripcion
        persona = Object.assign(persona, {zeus});
      }
    }
    return persona;
  }

  async findOneCi(id: string) {
    const persona = await this.personaRepository.findOne({where:{ ci:id}});
    if ( !persona ) return  {estado: 2, message: `La Persona con CI: ${id} no existe.`}

    const usuario : any = await this.usuarioService.findOneByPersona(persona.ci);
    if(!usuario.estado) return {persona, usuario, estado: 3, message: "Existe un usuario registrado con ese CI"};
      else return {persona,usuario,estado:usuario.estado, message: "Existe una persona registrada con ese CI"};
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
    await this.usuarioService.remove(persona.usuario.id)
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
