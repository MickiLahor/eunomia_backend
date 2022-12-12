import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignacionService } from 'src/asignacion/asignacion.service';
import { TipoExcusaService } from 'src/tipo-excusa/tipo-excusa.service';
import { Repository } from 'typeorm';
import { CreateExcusaDto } from './dto/create-excusa.dto';
import { UpdateExcusaDto } from './dto/update-excusa.dto';
import { Excusa } from './entities/excusa.entity';

@Injectable()
export class ExcusaService {
  private readonly logger = new Logger('ExcusaService')
  
  constructor(
    @InjectRepository(Excusa)
    private readonly excusaRepository: Repository<Excusa>,
    private readonly tipoExcusaService: TipoExcusaService,
    private readonly asignacionService: AsignacionService,  
      
  ){}
  async create(createExcusaDto: CreateExcusaDto) {
    try {
      const excusa = this.excusaRepository.create({
        ...createExcusaDto,
        tipoExcusa: await this.tipoExcusaService.findOne(createExcusaDto.idTipoExcusa),
        asignacion : await this.asignacionService.findOne(createExcusaDto.idAsignacion),
        url: createExcusaDto.archivo,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.excusaRepository.save(excusa);
      return excusa;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

 async findAll() {
    const excusa = await this.excusaRepository.find({
      where:{registroActivo:true},
      relations:{
        asignacion: {
          proceso:true
        }
      }
      
  });
    return excusa;
  }

  async findOne(id: string) {
    const excusa = await this.excusaRepository.findOne({where:{id,registroActivo:true}});
    if ( !excusa ) throw new NotFoundException(`La excusa con id: ${id} no existe.`);
    return excusa;
  }
 
  async update(id: string, updateExcusaDto: UpdateExcusaDto) {
    const excusa = await this.excusaRepository.preload({id, ...updateExcusaDto });
    
    if ( !excusa ) throw new NotFoundException(`Excusa con el id: ${id} no existe`);
    if(excusa.registroActivo===false) throw new NotFoundException(`Tipo Excusa con el id: ${id} fue dado de baja`);
    try {
      excusa.asignacion = await this.asignacionService.findOne(updateExcusaDto.idAsignacion);
      excusa.tipoExcusa = await this.tipoExcusaService.findOne(updateExcusaDto.idTipoExcusa);
      await this.excusaRepository.save(excusa);
      return excusa;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const excusa = await this.findOne(id);
    excusa.registroActivo=false;
    await this.excusaRepository.save(excusa)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
