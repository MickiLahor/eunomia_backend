import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoProcesoDto } from './dto/create-tipoproceso.dto';
import { UpdateTipoProcesoDto } from './dto/update-tipoproceso.dto';
import { TipoProceso } from './entities/tipoproceso.entity';

@Injectable()
export class TipoProcesoService {
  private readonly logger = new Logger('TipoProcesoService');

  constructor(
    @InjectRepository(TipoProceso)
    private readonly tipoProcesoRepository: Repository<TipoProceso>,
  ){}

  async create(createTipoprocesoDto: CreateTipoProcesoDto) {
    try {
      const tipoProceso = this.tipoProcesoRepository.create({
        ...createTipoprocesoDto,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.tipoProcesoRepository.save(tipoProceso);
      return tipoProceso;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

 async findAllSelect() {
   const tipoProceso = await this.tipoProcesoRepository.find({
      where:{registroActivo:true},
      select:{id:true,descripcion:true}
  });
    return tipoProceso;
  }

  async findAll() {
    const tipoProceso = await this.tipoProcesoRepository.find({
       where:{registroActivo:true}
   });
     return tipoProceso;
   }

  async findOne(id: string) {
    const tipoProceso = await this.tipoProcesoRepository.findOne({where:{id,registroActivo:true}});
    if ( !tipoProceso ) throw new NotFoundException(`El tipo proceso con id: ${id} no existe.`);
    return tipoProceso;
  }

  async update(id: string, updateTipoprocesoDto: UpdateTipoProcesoDto) {
    const tipoProceso = await this.tipoProcesoRepository.preload({id, ...updateTipoprocesoDto });
    
    if ( !tipoProceso ) throw new NotFoundException(`Tipo Proceso con el id: ${id} no existe`);
    if(tipoProceso.registroActivo===false) throw new NotFoundException(`Tipo Proceso con el id: ${id} fue dado de baja`);
    try {
      await this.tipoProcesoRepository.save(tipoProceso);
      return tipoProceso;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const tipoProceso = await this.findOne(id);
    tipoProceso.registroActivo=false;
    await this.tipoProcesoRepository.save(tipoProceso)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
