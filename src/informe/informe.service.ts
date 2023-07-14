import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateInformeDto } from './dto/create-informe.dto';
import { UpdateInformeDto } from './dto/update-informe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Informe } from './entities/informe.entity';
import { AsignacionService } from 'src/asignacion/asignacion.service';
import { Repository } from 'typeorm';
import { TipoInformeService } from 'src/tipo_informe/tipo_informe.service';

@Injectable()
export class InformeService {

  private readonly logger = new Logger('InformeService')
  constructor(
    @InjectRepository(Informe)
    private readonly informeRepository: Repository<Informe>,
    private readonly asignacionService: AsignacionService,  
    private readonly tipoInformeService: TipoInformeService,  
      
  ){}
  async create(createInformeDto: CreateInformeDto) {
    try {
      const informe = this.informeRepository.create({
        ...createInformeDto,
        asignacion : await this.asignacionService.findOne(createInformeDto.idAsignacion),
        tipo_informe : await this.tipoInformeService.findOne(createInformeDto.idTipoInforme),
        url: createInformeDto.archivo,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.informeRepository.save(informe);
      return informe;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const informe = await this.informeRepository.find({
      where:{registroActivo:true},
      relations:{
        asignacion: {
          proceso:true
        }
      }
      
  });
    return informe;
  }

  async findOne(id: string) {
    const informe = await this.informeRepository.findOne({where:{id,registroActivo:true}});
    if ( !informe ) throw new NotFoundException(`El informe con id: ${id} no existe.`);
    return informe;
  }

  async update(id: string, updateInformeDto: UpdateInformeDto) {
    const informe = await this.informeRepository.preload({id, ...updateInformeDto });
    
    if ( !informe ) throw new NotFoundException(`Informe con el id: ${id} no existe`);
    if(informe.registroActivo===false) throw new NotFoundException(`El informe con el id: ${id} fue dado de baja`);
    try {
      informe.asignacion = await this.asignacionService.findOne(updateInformeDto.idAsignacion);
      //excusa.tipoExcusa = await this.tipoExcusaService.findOne(updateExcusaDto.idTipoExcusa);
      await this.informeRepository.save(informe);
      return informe;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const informe = await this.findOne(id);
    informe.registroActivo=false;
    await this.informeRepository.save(informe)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
