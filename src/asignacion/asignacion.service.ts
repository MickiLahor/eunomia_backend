import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { Asignacion } from './entities/asignacion.entity';

@Injectable()
export class AsignacionService {

  private readonly logger = new Logger('AsignacionService')


  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
  ){}
  
  async create(createAsignacionDto: CreateAsignacionDto) {
    try {
      const asignacion = this.asignacionRepository.create({
        ...createAsignacionDto,
        usuarioRegistro: createAsignacionDto.proceso.usuarioRegistro,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.asignacionRepository.save(asignacion);
      
      return asignacion;
    }
    catch(error) {
      console.log(error); 
      this.handleDBExpeptions(error);
    }
  }

  findAll() {
    return `This action returns all asignacion`;
  }

  async findOne(id: string) {
    const asignacion = await this.asignacionRepository.findOne({where:{id,registroActivo:true}});
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
