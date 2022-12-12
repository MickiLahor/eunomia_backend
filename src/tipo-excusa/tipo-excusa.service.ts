import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoProceso } from 'src/tipoproceso/entities/tipoproceso.entity';
import { Repository } from 'typeorm';
import { CreateTipoExcusaDto } from './dto/create-tipo-excusa.dto';
import { UpdateTipoExcusaDto } from './dto/update-tipo-excusa.dto';
import { TipoExcusa } from './entities/tipo-excusa.entity';

@Injectable()
export class TipoExcusaService {
  private readonly logger = new Logger('TipoProcesoService');

  constructor(
    @InjectRepository(TipoExcusa)
    private readonly tipoExcusaRepository: Repository<TipoExcusa>,
  ){}

  async create(createTipoExcusaDto: CreateTipoExcusaDto) {
    try {
      const tipoExcusa = this.tipoExcusaRepository.create({
        ...createTipoExcusaDto,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.tipoExcusaRepository.save(tipoExcusa);
      return tipoExcusa;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

 async findAll() {
    const tipoExcusa = await this.tipoExcusaRepository.find({
      where:{registroActivo:true}
  });
    return tipoExcusa;
  }

  async findAllSelect() {
    const tipoExcusa = await this.tipoExcusaRepository.find({
       where:{registroActivo:true},
       select:{id:true,descripcion:true}
   });
     return tipoExcusa;
   }

  async findOne(id: string) {
    const tipoExcusa = await this.tipoExcusaRepository.findOne({where:{id,registroActivo:true}});
    if ( !tipoExcusa ) throw new NotFoundException(`El tipo excusa con id: ${id} no existe.`);
    return tipoExcusa;
  }

  async update(id: string, updateTipoExcusaDto: UpdateTipoExcusaDto) {
    const tipoExcusa = await this.tipoExcusaRepository.preload({id, ...updateTipoExcusaDto });
    
    if ( !tipoExcusa ) throw new NotFoundException(`Tipo Excusa con el id: ${id} no existe`);
    if(tipoExcusa.registroActivo===false) throw new NotFoundException(`Tipo Excusa con el id: ${id} fue dado de baja`);
    try {
      await this.tipoExcusaRepository.save(tipoExcusa);
      return tipoExcusa;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const tipoExcusa = await this.findOne(id);
    tipoExcusa.registroActivo=false;
    await this.tipoExcusaRepository.save(tipoExcusa)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);
    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
