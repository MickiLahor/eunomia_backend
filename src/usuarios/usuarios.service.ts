import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonaService } from 'src/persona/persona.service';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  
  private readonly logger = new Logger('PersonaService')
  
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly personaService: PersonaService,
  ){}


  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const usuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        persona : await this.personaService.findOne(createUsuarioDto.idPersona),
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.usuarioRepository.save(usuario);
      
      return usuario;
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async findAll() {
    const usuarios = await this.usuarioRepository.find({
     where:{registroActivo:true}
 });
 return usuarios;
 }

async login(loginUsuarioDto: LoginUsuarioDto) {
  const usuarios = await this.usuarioRepository.findOne(
    {
      where:
      {
        registroActivo:true,
        usuario:loginUsuarioDto.usuario,
        clave:loginUsuarioDto.clave
      }
    }
  );
if(usuarios) return usuarios;
else throw new UnauthorizedException(`Acceso no autorizado a: ${loginUsuarioDto.usuario}`);
}

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
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
