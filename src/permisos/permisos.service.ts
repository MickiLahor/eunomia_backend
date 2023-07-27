import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { Permiso } from './entities/permiso.entity';

@Injectable()
export class PermisosService {
  private readonly logger = new Logger('PermisosService')

  constructor(
    @InjectRepository(Permiso)
    private readonly permisosRepository: Repository<Permiso>,
  ){}


  async create(createPermisoDto: CreatePermisoDto) {
    try {
      const permiso = this.permisosRepository.create({
        ...createPermisoDto,
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.permisosRepository.save(permiso);
      
      return permiso;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10,page= 0} = paginationDto
    const permisos = await this.permisosRepository.find({
      take: limit,
      skip: page,
      where:{registro_activo:true}
  });
  return permisos;
  }

  async findOne(id: string) {
    const permiso = await this.permisosRepository.findOne({where:{id,registro_activo:true}});
    if ( !permiso ) throw new NotFoundException(`El permiso con id: ${id} no existe.`);
    return permiso;
  }

  async update(id: string, updatePermisoDto: UpdatePermisoDto) {
    const permiso = await this.permisosRepository.preload({id, ...updatePermisoDto });
    
    if ( !permiso ) throw new NotFoundException(`Permiso con el id: ${id} no existe`);
    if(permiso.registro_activo===false) throw new NotFoundException(`Permiso con el id: ${id} fue dado de baja`);
    try {
      await this.permisosRepository.save(permiso);
      return permiso;
    } catch (error) {
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const permiso = await this.findOne(id);
    permiso.registro_activo=false;
    await this.permisosRepository.save(permiso)
    return { message:"Eliminado correctamente." };
  }

  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
