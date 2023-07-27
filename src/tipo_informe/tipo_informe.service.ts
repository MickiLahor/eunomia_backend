import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTipoInformeDto } from './dto/create-tipo_informe.dto';
import { UpdateTipoInformeDto } from './dto/update-tipo_informe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoInforme } from './entities/tipo_informe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoInformeService {
  private readonly logger = new Logger('TipoInformeService');
  
  constructor(
    @InjectRepository(TipoInforme)
    private readonly tipoInformeRepository: Repository<TipoInforme>,
  ){}


  async create(createTipoInformeDto: CreateTipoInformeDto) {
    try {
      const tipoInforme = this.tipoInformeRepository.create({
        ...createTipoInformeDto,
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.tipoInformeRepository.save(tipoInforme);
      return tipoInforme;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const tipoInforme = await this.tipoInformeRepository.find({
      where:{registro_activo:true}
  });
    return tipoInforme;
  }

  async findAllSelect() {
    const tipoInforme = await this.tipoInformeRepository.find({
       where:{registro_activo:true},
       select:{id:true,descripcion:true}
   });
     return tipoInforme;
   }

  async findOne(id: string) {
    const tipoInforme = await this.tipoInformeRepository.findOne({where:{id,registro_activo:true}});
    if ( !tipoInforme) throw new NotFoundException(`El tipo informe con id: ${id} no existe.`);
    return tipoInforme;
  }

  async update(id: string, updateTipoInformeDto: UpdateTipoInformeDto) {
    const tipoInforme = await this.tipoInformeRepository.preload({id, ...updateTipoInformeDto });
    
    if ( !tipoInforme ) throw new NotFoundException(`Tipo Informe con el id: ${id} no existe`);
    if(tipoInforme.registro_activo===false) throw new NotFoundException(`Tipo Excusa con el id: ${id} fue dado de baja`);
    try {
      await this.tipoInformeRepository.save(tipoInforme);
      return tipoInforme;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const tipoIInforme = await this.findOne(id);
    tipoIInforme.registro_activo=false;
    await this.tipoInformeRepository.save(tipoIInforme)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
