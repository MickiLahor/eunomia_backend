import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ResetPasswordUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import * as bcrypt from 'bcrypt'
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonaService } from 'src/persona/persona.service';
import { LoginDto } from './dto/login.dto';
import { ZeusResponseDto } from './dto/zeus-response.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { ConfigService } from '@nestjs/config';
import { CreatePersonaUsuarioDto } from './dto/create-persona-usuario.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly personaService: PersonaService,
    private readonly jwtService: JwtService,
    private readonly http: AxiosAdapter,
    private readonly configService: ConfigService,
    private readonly rolService: RolesService,
  ){}

  async create(createAuthDto: CreateAuthDto) {
    try {

      const {clave, ...userData} = createAuthDto
      const usuario = this.usuarioRepository.create({
        ...userData,
        clave : bcrypt.hashSync(clave,10),
        persona : await this.personaService.findOne(userData.idPersona),
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.usuarioRepository.save(usuario);

      delete usuario.clave

      return {  ...usuario,
        token: this.getJwtToken( { user: usuario })
     };
      //TODO: Retornar el JWT de acceso
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async createAll(createAuthDto: CreatePersonaUsuarioDto) {
    try {

      const persona = await this.personaService.create({...createAuthDto})
     
      const {...userData} = createAuthDto
      const usuario = this.usuarioRepository.create({
        idCiudad : userData.idCiudad,
        idOficina: userData.idOficina,
        usuario: userData.ci,
        usuarioRegistro: userData.usuarioRegistro,
        roles:  await this.rolService.findBy({ id: In(userData.roles) }),
        clave : bcrypt.hashSync(userData.ci,10),
        persona : persona,
        fechaRegistro:new Date(),
        registroActivo: true
      });

      await this.usuarioRepository.save(usuario);

      delete usuario.clave

      return {  ...usuario,
        token: this.getJwtToken( { user: usuario })
     };
      //TODO: Retornar el JWT de acceso
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    try {
      const user = await this.usuarioRepository.findOne({where:{id:resetPasswordUserDto.idUsuario,registroActivo:true}});
      user.clave = bcrypt.hashSync(user.persona.ci,10),
      user.usuarioRegistro = resetPasswordUserDto.usuarioRegistro;
      await this.usuarioRepository.save(user)
      return { message:"Clave reestablecida correctamente." };
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async login(loginUsuarioDto: LoginDto) {

    const { clave, usuario } = loginUsuarioDto;
  
    const user = await this.usuarioRepository.findOne(
      {
        where:
        {
          registroActivo:true,
          usuario:usuario,
        }
      }
    );
  
    if(!user) 
    return { message: `Acceso no autorizado a: ${usuario}`, error: "Unauthorized"  };
    //throw new UnauthorizedException(`Acceso no autorizado a: ${usuario}`);
  
    if(!bcrypt.compareSync(clave,user.clave)) 
    return { message: `Credenciales no validas para: ${usuario}`, error: "Unauthorized"  };
    //throw new UnauthorizedException(`Credenciales no validas para: ${usuario}`);
  
    const zeus = await this.getOficinaZeusPro(user.idOficina);

    delete user.clave

    return {  ...user,
              token: this.getJwtToken({user: user}),
              zeus
           };
  
    //TODO: retornar el JWT
  }

  private async getOficinaZeusPro(idOficina: number) : Promise<ZeusResponseDto>
  {
    const data = await this.http.get<ZeusResponseDto>(`${this.configService.get('URL_ZEUS')}/api/oficina/getOficina/${idOficina}`);
    return data;
  }

  private getJwtToken(payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }
  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
