import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity';

@Injectable()
export class MateriaService {
  private readonly logger = new Logger('MateriaService');

  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
  ){}

  async create(createMateriaDto: CreateMateriaDto) {
    try {
      const materia = this.materiaRepository.create({
        ...createMateriaDto,
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.materiaRepository.save(materia);
      return materia;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

 async findAllSelect() {
   const materia = await this.materiaRepository.find({
      where:{registro_activo:true},
      select:{id:true,descripcion:true}
  });
    return materia;
  }

  async findAll() {
    const materia = await this.materiaRepository.find({
       where:{registro_activo:true}
   });
     return materia;
   }

  async findOne(id: string) {
    const materia = await this.materiaRepository.findOne({where:{id,registro_activo:true}});
    if ( !materia ) throw new NotFoundException(`La materia con el id: ${id} no existe.`);
    return materia;
  }

  async update(id: string, updateMateriaDto: UpdateMateriaDto) {
    const materia = await this.materiaRepository.preload({id, ...updateMateriaDto });
    
    if ( !materia ) throw new NotFoundException(`La materia con el id: ${id} no existe`);
    if(materia.registro_activo===false) throw new NotFoundException(`Tipo Proceso con el id: ${id} fue dado de baja`);
    try {
      await this.materiaRepository.save(materia);
      return materia;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const materia = await this.findOne(id);
    materia.registro_activo=false;
    await this.materiaRepository.save(materia)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
