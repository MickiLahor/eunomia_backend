import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { FindOperator, FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolesService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>, 
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ){}

 async create(createRoleDto: CreateRoleDto) {
    try {

      const {permisos = [], ...rolDetails} = createRoleDto

     const rol = this.rolRepository.create(
        {
          ...rolDetails,
          fechaRegistro: new Date(),
          registroActivo: true,
          permisos: await this.permisoRepository.findBy( {id: In(permisos) })
        }
      );
      await this.rolRepository.save( rol );

      return rol;
      
    } catch (error) {
     this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const roles = await this.rolRepository.find({
     where:{registroActivo:true}
      });
    return roles;
  }

  async findOne(id: string) {
    const rol = await this.rolRepository.findOne({where:{id,registroActivo:true}});
    if ( !rol ) throw new NotFoundException(`El rol con id: ${id} no existe.`);
    return rol;
  }

  async findBy(id: FindOptionsWhere<Rol> | FindOptionsWhere<Rol>[]) {
    const rol = await this.rolRepository.findBy(id);
    if ( !rol ) throw new NotFoundException(`El rol con id: ${id} no existe.`);
    return rol;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { permisos = [], ...toUpdate } = updateRoleDto
    
    const rol = await this.rolRepository.preload({id, ...toUpdate });
    
    if ( !rol ) throw new NotFoundException(`Rol con el id: ${id} no existe`);
    if(rol.registroActivo===false) throw new NotFoundException(`Rol con el id: ${id} fue dado de baja`);
    try {

      rol.permisos= await this.permisoRepository.findBy( {id: In(permisos) })
      await this.rolRepository.save(rol);
      return rol;

    } catch (error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async remove(id: string) {
    const rol = await this.findOne(id);
    rol.registroActivo=false;
    await this.rolRepository.save(rol)
    return { menssage:"Eliminado correctamente." };
  }
  
  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
