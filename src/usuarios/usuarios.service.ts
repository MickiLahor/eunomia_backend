import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
import { RolesService } from 'src/roles/roles.service';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SearchUsuarioDto } from 'src/common/dtos/search.dto';

@Injectable()
export class UsuariosService {
  
  private readonly logger = new Logger('UsuarioService')
  
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly rolService: RolesService,
  ){}


  async asignarRoles(id: string, updateRolUsuarioDto: UpdateRolUsuarioDto) {
    const { roles = [] } = updateRolUsuarioDto
    
    const user = await this.usuarioRepository.preload({ id });
    
    if ( !user ) throw new NotFoundException(`Usuario con el id: ${id} no existe`);
    if(user.registroActivo===false) throw new NotFoundException(`Usuario con el id: ${id} fue dado de baja`);
    try {

      user.roles= await this.rolService.findBy({ id: In(roles) })
      await this.usuarioRepository.save(user);
      return user;

    } catch (error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }


  async findAll(options: IPaginationOptions) {
    return this.paginate(options)
 }

 async paginate(options: IPaginationOptions): Promise<Pagination<Usuario>> {
  return paginate<Usuario>(this.usuarioRepository, options, {
    where:{registroActivo:true,
      roles:[
        {registroActivo:true}
      ]
    },
    order: {fechaRegistro: 'DESC'}
  });
}

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOne({where:{id,registroActivo:true}});
    if ( !usuario ) throw new NotFoundException(`El usuario con id: ${id} no existe.`);
    return usuario;
  }

  async search(options: IPaginationOptions, searchDto: SearchUsuarioDto) {
    const {ci = "",nombres= "", usuario="", rol=""} = searchDto
    return paginate<Usuario>(this.usuarioRepository, options, {
      where:    
      [
        { usuario: ILike(`%${usuario}%`),registroActivo:true},
        {
          persona: [
          { ci: ILike(`%${ci}%`),registroActivo:true},
          { nombreCompleto: ILike(`%${nombres}%`),registroActivo:true},
        ]},
        {
          roles: [
          { descripcion: ILike(`%${rol}%`),registroActivo:true},
          ]},
      ],
      order: {fechaRegistro: 'DESC'}
    });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
  
  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
