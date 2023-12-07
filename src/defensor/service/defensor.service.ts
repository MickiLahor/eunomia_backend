import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SearchDefendorDto, SearchDto } from 'src/common/dtos/search.dto';
import { MateriaService } from 'src/materia/service/materia.service';
import { PersonaService } from 'src/persona/service/persona.service';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateDefensorDto } from '../dto/create-defensor.dto';
import { UpdateDefensorDto } from '../dto/update-defensor.dto';
import { Defensor } from '../entities/defensor.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class DefensorService {

  private readonly logger = new Logger('DefensorService')

  constructor(
    @InjectRepository(Defensor)
    private readonly defensorRepository: Repository<Defensor>,
    private readonly personaService: PersonaService,
    private readonly materiaService: MateriaService,
    @Inject(forwardRef(() => CommonService))
    private readonly commonService: CommonService
  ){}

  async create(createDefensorDto: CreateDefensorDto) {
    try {
      const defensor = this.defensorRepository.create({
        ...createDefensorDto,
        persona : await this.personaService.findOne(createDefensorDto.id_persona),
        habilitado:true,
        sorteado:false,
        materia : await this.materiaService.findOne(createDefensorDto.id_materia),
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.defensorRepository.save(defensor);
      
      return defensor;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Defensor>> {
    return paginate<Defensor>(this.defensorRepository, options, {
      where: { registro_activo:true },
      relations:{persona:true},
      order: { fecha_registro: 'DESC' }
    });
  }

  async search(options: IPaginationOptions, searchDto: SearchDefendorDto) {
    const { matricula = "", nombre_completo="" } = searchDto
    let defensor = await paginate<Defensor>(this.defensorRepository, options, {
      where:    
      [
        { matricula: ILike(`%${matricula}%`),registro_activo:true},
        { persona: { nombre_completo: ILike(`%${nombre_completo}%`),registro_activo:true } },
      ],
      relations:{persona: true, materia: true},
      order: {fecha_registro: 'DESC'}
    });

    if (defensor.items.length !== 0) {
      for (let i = 0; i < defensor.items.length; i++) {
          const zeus = {id_departamento: null, departamento: null, id_municipio: null, municipio: null}
          const departamentos = await this.commonService.getDepartamentoZeusPro()
          const municipios = await this.commonService.getMunicipioZeusPro(defensor.items[i].id_departamento)
          const departamento = departamentos.find((dep) => dep.id_departamento === defensor.items[i].id_departamento)
          const municipio = municipios.find((mun) => mun.id_municipio === defensor.items[i].id_ciudad)
          zeus.id_departamento = departamento.id_departamento
          zeus.departamento = departamento.descripcion
          zeus.id_municipio = municipio.id_municipio
          zeus.municipio = municipio.descripcion
          defensor.items[i] = Object.assign(defensor.items[i], {zeus});
      }
    }
    return defensor
  }

  async findAllServicios() {
    const defensores = await this.defensorRepository.find({
      where:{registro_activo:true},
      relations:{asignaciones:true,persona:true}
  });
    return defensores;
  }

  async findAll(options: IPaginationOptions) {
    return this.paginate(options)
  }

  async sorteo(idCiudad: number, idMateria: string): Promise<Defensor> {//aumentar condicion de proceso que un defensor no sea sorteado si presento su excusa
    try {
      let cantidadDefensores = await this.defensorRepository.find({
        where:
        {
          registro_activo:true,
          habilitado:true,
          id_ciudad:idCiudad,
          materia: await this.materiaService.findOne(idMateria),
        }
      });
      if (cantidadDefensores.length !== 0) {
        let defensores = await this.defensorRepository.find({
          where:
          {
            registro_activo:true,
            sorteado:false,
            habilitado:true,
            id_ciudad:idCiudad,
            materia: await this.materiaService.findOne(idMateria),
          }
        });
    
        if(defensores.length===0) {
          await this.defensorRepository.update(
            { registro_activo:true, habilitado:true,id_ciudad:idCiudad,materia: await this.materiaService.findOne(idMateria) },
            { sorteado:false }
          )
          defensores = await this.defensorRepository.find({
            where:{ registro_activo:true,sorteado:false,habilitado:true,id_ciudad:idCiudad,materia: await this.materiaService.findOne(idMateria) }
          });
        }
        const ramdom = Math.floor(Math.random() * defensores.length)
        let defensor: Defensor = defensores[ramdom]
        defensor.sorteado=true;
        await this.defensorRepository.save(defensor);
        const defensorAsignado = this.findOne(defensor.id)
        return defensorAsignado;
      } else {
        return null
      }
    } catch (error) {
      console.log(error);
      this.handleDBExpeptions(error);
    }
    
    
    
  }

  async sorteoExcusa(asignacion: Asignacion): Promise<Defensor> {//aumentar condicion de proceso que un defensor no sea sorteado si presento su excusa
    const ids : string[] = asignacion.proceso.asignaciones.map(x=>x.defensor.id)
    let defensores = await this.defensorRepository
    .createQueryBuilder("defensor")
    .where("defensor.id NOT IN (:...ids)",{ids: ids})
    .andWhere("defensor.registro_activo = true")
    .andWhere("defensor.sorteado = false")
    .andWhere("defensor.habilitado = true")
    .andWhere("defensor.id_ciudad = :id_ciudad",{id_ciudad:asignacion.proceso.id_ciudad})
    .andWhere("defensor.id_materia = :id_materia",{id_materia:asignacion.proceso.materia.id}).getMany();
    if(defensores.length===0) {
      await this.defensorRepository.update(
        { registro_activo:true, habilitado:true,
          id_ciudad: asignacion.proceso.id_ciudad,materia: await this.materiaService.findOne(asignacion.proceso.materia.id)},
        { sorteado:false }
      )
      defensores = await this.defensorRepository
      .createQueryBuilder("defensor")
      .where("defensor.id NOT IN (:...ids)",{ids: ids})
      .andWhere("defensor.registro_activo = true")
      .andWhere("defensor.sorteado = false")
      .andWhere("defensor.habilitado = true")
      .andWhere("defensor.id_ciudad = :id_ciudad",{id_ciudad:asignacion.proceso.id_ciudad})
      .andWhere("defensor.id_materia = :id_materia",{id_materia:asignacion.proceso.materia.id}).getMany();
      if(defensores.length===0) return null;
    }
    const ramdom = Math.floor(Math.random() * defensores.length)
    let defensor: Defensor = defensores[ramdom]
    defensor.sorteado=true;
    await this.defensorRepository.save(defensor);
    return defensores[ramdom];
  }

  async findOne(id: string) {
    let defensor = await this.defensorRepository.findOne(
      {
        where:{id,registro_activo:true},
        relations:{persona: true, materia: true}
      });
      // console.log(defensor);
      
    if ( !defensor ) {
      throw new NotFoundException(`El Defensor con id: ${id} no existe.`);
    } else {
      const zeus = {id_departamento: null, departamento: null, id_municipio: null, municipio: null}
      const departamentos = await this.commonService.getDepartamentoZeusPro()
      const municipios = await this.commonService.getMunicipioZeusPro(defensor.id_departamento)
      const departamento = departamentos.find((dep) => dep.id_departamento === defensor.id_departamento)
      const municipio = municipios.find((mun) => mun.id_municipio === defensor.id_ciudad)
      zeus.id_departamento = departamento.id_departamento
      zeus.departamento = departamento.descripcion
      zeus.id_municipio = municipio.id_municipio
      zeus.municipio = municipio.descripcion
      defensor = Object.assign(defensor, {zeus});
    } 
    return defensor;
  }

  async update(id: string, updateDefensorDto: UpdateDefensorDto) {    
    const defensor = await this.defensorRepository.preload({id, ...updateDefensorDto });
    
    if ( !defensor ) throw new NotFoundException(`El Defensor con el id: ${id} no existe`);
    if(defensor.registro_activo===false) throw new NotFoundException(`El Defensor con el id: ${id} fue dado de baja`);
    try {
      await this.defensorRepository.save(defensor);
      return {...defensor, message: 'Datos actualizados.'};
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const defensor = await this.findOne(id);
    defensor.registro_activo=false;
    await this.defensorRepository.save(defensor)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
