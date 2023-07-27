import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Estado } from './entities/estado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoService {
  private readonly logger = new Logger('EstadoService');

  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ){}

  async create(createEstadoDto: CreateEstadoDto) {
    try {
      const estado = this.estadoRepository.create({
        ...createEstadoDto,
        fecha:new Date(),
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.estadoRepository.save(estado);
      return estado;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }
 
  async findAll() {
    const estado = await this.estadoRepository.find({
      where:{registro_activo:true}
    });
    return estado;
  }
  
  async findOne(id: string) {
    const estado = await this.estadoRepository.findOne({where:{id,registro_activo:true}});
    if ( !estado ) throw new NotFoundException(`El estado con id: ${id} no existe.`);
    return estado;
  }

  async findOneDescripcion(descripcion: string) {
    const estado = await this.estadoRepository.findOne(
      {
        where:{
          descripcion:descripcion,
          registro_activo:true
        }});
    if ( !estado ) throw new NotFoundException(`El estado con descripcion: ${descripcion} no existe.`);
    return estado;
  }

  update(id: number, updateEstadoDto: UpdateEstadoDto) {
    return `This action updates a #${id} estado`;
  }

  remove(id: number) {
    return `This action removes a #${id} estado`;
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
