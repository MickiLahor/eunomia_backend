import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SearchDefendorDto, SearchDto } from 'src/common/dtos/search.dto';
import { MateriaService } from 'src/materia/materia.service';
import { PersonaService } from 'src/persona/persona.service';
import { ILike, Repository } from 'typeorm';
import { CreateDefensorDto } from './dto/create-defensor.dto';
import { UpdateDefensorDto } from './dto/update-defensor.dto';
import { Defensor } from './entities/defensor.entity';

@Injectable()
export class DefensorService {

  private readonly logger = new Logger('DefensorService')

  constructor(
    @InjectRepository(Defensor)
    private readonly defensorRepository: Repository<Defensor>,
    private readonly personaService: PersonaService,
    private readonly materiaService: MateriaService,
  ){}

 async create(createDefensorDto: CreateDefensorDto) {
    try {
      const defensor = this.defensorRepository.create({
        ...createDefensorDto,
        persona : await this.personaService.findOne(createDefensorDto.idPersona),
        habilitado:true,
        sorteado:false,
        materia : await this.materiaService.findOne(createDefensorDto.idMateria),
        fechaRegistro:new Date(),
        registroActivo: true
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
      where: { registroActivo:true },
      order: { fechaRegistro: 'DESC' }
    });
  }

  async search(options: IPaginationOptions, searchDto: SearchDefendorDto) {
    const {matricula = "",nombreCompleto=""} = searchDto
    return paginate<Defensor>(this.defensorRepository, options, {
      where:    
      [
        { matricula: ILike(`%${matricula}%`),registroActivo:true},
        { persona: { nombreCompleto: ILike(`%${nombreCompleto}%`),registroActivo:true } },
        {registroActivo:true}
      ],
      order: {fechaRegistro: 'DESC'}
    });
  }

  async findAllServicios() {
    const defensores = await this.defensorRepository.find({
      where:{registroActivo:true},
      relations:{asignaciones:true}
  });
    return defensores;
  }

  async findAll(options: IPaginationOptions) {
    return this.paginate(options)
  }

  async sorteo(idCiudad: number, idMateria: string): Promise<Defensor> {
    let defensores = await this.defensorRepository.find({
      where:
      {
        registroActivo:true,
        sorteado:false,
        habilitado:true,
        idCiudad:idCiudad,
        materia: await this.materiaService.findOne(idMateria)
      }
    });

    if(defensores.length===0) {
      await this.defensorRepository.update(
        { registroActivo:true, habilitado:true,idCiudad:idCiudad,materia: await this.materiaService.findOne(idMateria) },
        { sorteado:false }
      )
      defensores = await this.defensorRepository.find({
        where:{ registroActivo:true,sorteado:false,habilitado:true,idCiudad:idCiudad,materia: await this.materiaService.findOne(idMateria) }
      });
    }
    const ramdom = Math.floor(Math.random() * defensores.length)
    let defensor: Defensor = defensores[ramdom]
    defensor.sorteado=true;
    await this.defensorRepository.save(defensor);
    return defensores[ramdom];
  }

  async findOne(id: string) {
    const defendor = await this.defensorRepository.findOne({where:{id,registroActivo:true}});
    if ( !defendor ) throw new NotFoundException(`El defensoor con id: ${id} no existe.`);
    return defendor;
  }

  async update(id: string, updateDefensorDto: UpdateDefensorDto) {
    const defensor = await this.defensorRepository.preload({id, ...updateDefensorDto });
    
    if ( !defensor ) throw new NotFoundException(`El Defensor con el id: ${id} no existe`);
    if(defensor.registroActivo===false) throw new NotFoundException(`El Defensor con el id: ${id} fue dado de baja`);
    try {
      await this.defensorRepository.save(defensor);
      return defensor;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const defensor = await this.findOne(id);
    defensor.registroActivo=false;
    await this.defensorRepository.save(defensor)
    return { menssage:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
