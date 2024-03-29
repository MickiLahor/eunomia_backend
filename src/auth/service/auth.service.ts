import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateAuthDto, ResetPasswordUserDto } from '../dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';
import * as bcrypt from 'bcrypt'
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonaService } from 'src/persona/service/persona.service';
import { LoginDto } from '../dto/login.dto';
import { ZeusDto, ZeusResponseDto } from '../dto/zeus-response.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { ConfigService } from '@nestjs/config';
import { CreatePersonaUsuarioDto } from '../dto/create-persona-usuario.dto';
import { RolesService } from 'src/roles/service/roles.service';
import { Roles } from 'src/common/enums/enums';
import { DefensorService } from 'src/defensor/service/defensor.service';
import { UpdatePersonaUsuarioDto } from '../dto/update-persona-usuario.dto';
import { UsuariosService } from 'src/usuarios/service/usuarios.service';
import { SegipDto, SegipRespondeDto } from '../dto/segip.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly personaService: PersonaService,
    private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly http: AxiosAdapter,
    private readonly configService: ConfigService,
    private readonly rolService: RolesService,
    private readonly defensorService: DefensorService
  ){}

  async create(createAuthDto: CreateAuthDto) {
    try {

      const {clave, ...userData} = createAuthDto
      const usuario = this.usuarioRepository.create({
        ...userData,
        clave : bcrypt.hashSync(clave,10),
        persona : await this.personaService.findOne(userData.id_persona),
        fecha_registro:new Date(),
        registro_activo: true
      });

      await this.usuarioRepository.save(usuario);

      delete usuario.clave

      return {  ...usuario,
        token: this.getJwtToken( { user: usuario, zeus:null })
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
      const existUsuario = await this.personaService.findOneCi(createAuthDto.ci)
      if (existUsuario.estado === 2) {
        const persona = await this.personaService.create({...createAuthDto})
        const {...userData} = createAuthDto
        const usuario = this.usuarioRepository.create({
          id_departamento : userData.id_departamento,
          id_ciudad : userData.id_ciudad,
          id_oficina: userData.id_oficina,
          usuario: userData.ci,
          usuario_registro: userData.usuario_registro,
          roles:  await this.rolService.findBy({ id: In(userData.roles) }),
          clave : bcrypt.hashSync(userData.ci,10),
          persona : persona,
          fecha_registro:new Date(),
          registro_activo: true
        });
        await this.usuarioRepository.save(usuario);
        // console.log(userData);
        const rol = await this.rolService.findOne(userData.roles[0]);
        
        if(rol.descripcion===Roles.Defensor)
        {
          await this.defensorService.create({
            ...userData,
            id_persona:persona.id,
          })
        }

        delete usuario.clave

        return {  ...usuario,
          message: 'Registro correcto.',
          error: false,
          token: this.getJwtToken( { user: usuario, zeus:null })
        };
        //TODO: Retornar el JWT de acceso
      } else {
        return {
          message: 'Registro duplicado.',
          error: true,
        }
      }
      
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async updateAll(id: string, updateAuthDto: UpdatePersonaUsuarioDto) {
    try {
      // const existUsuario = await this.personaService.findOneCi(updateAuthDto.ci)
      // if (existUsuario.estado === 2) {
        const persona = await this.personaService.findOne(id)
        await this.personaService.update(id, {...updateAuthDto})
        const {...userData} = updateAuthDto
        const usuario = await this.usuarioService.update(persona.usuario.id, {
          id_departamento : userData.id_departamento,
          id_ciudad : userData.id_ciudad,
          id_oficina: userData.id_oficina,
          usuario: userData.ci,
          clave : bcrypt.hashSync(userData.ci,10),
        });
        const defensor = await this.defensorService.update(persona.defensor.id, {
          id_departamento : userData.id_departamento,
          id_ciudad : userData.id_ciudad,
        });
        return {  ...usuario, ...defensor,
          message: 'Datos actualizados.',
          error: false,
        };
        // await this.usuarioRepository.save(usuario);
      //   // console.log(userData);
      //   const rol = await this.rolService.findOne(userData.roles[0]);
        
      //   if(rol.descripcion===Roles.Defensor)
      //   {
      //     await this.defensorService.create({
      //       ...userData,
      //       id_persona:persona.id,
      //     })
      //   }
      //   delete usuario.clave
      //   return {  ...usuario,
      //     message: 'Registro correcto',
      //     error: false,
      //     token: this.getJwtToken( { user: usuario, zeus:null })
      //   };
      //   //TODO: Retornar el JWT de acceso
      // } else {
      //   return {
      //     message: 'Registro duplicado',
      //     error: true,
      //   }
      // }
      
    }
    catch(error) {
      console.log(error);
      
      this.handleDBExpeptions(error);
    }
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    try {
      const user = await this.usuarioRepository.findOne({
        where: {id:resetPasswordUserDto.id_usuario,registro_activo:true},
        relations:{persona:true}
      });
      user.clave = bcrypt.hashSync(user.persona.ci,10),
      user.usuario_registro = resetPasswordUserDto.usuario_registro;
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
          registro_activo:true,
          usuario:usuario,
        }
        ,relations: { persona: true, roles: true }
      }
    );    
    
    if(!user) 
    return { message: `Acceso no autorizado a: ${usuario}`, error: "Unauthorized"  };
    //throw new UnauthorizedException(`Acceso no autorizado a: ${usuario}`);
  
    if(!bcrypt.compareSync(clave,user.clave)) 
    return { message: `Credenciales no validas para: ${usuario}`, error: "Unauthorized"  };
    delete user.clave
    //throw new UnauthorizedException(`Credenciales no validas para: ${usuario}`);
    
    // OJO - FALTA CREAR SERVICIO EN ZEUS PARA RECUPERAR INFORMACION POR ID CIUDAD O DEPARTAMENTO
    if(user.roles[0].descripcion === 'Defensor') {
      return { token: await this.getJwtToken({user: user,zeus: {
        id_oficina: 0,
        descripcion: 'Defensor de Oficio',
        id_ente: 0,
        ente: 'Órgano Judicial',
        id_departamento: 0,
        departamento: 'Bolivia',
        id_municipio: 0,
        municipio: 'M'
      }}), user: user };
    }
    const zeus = await this.getOficinaZeusPro(user.id_oficina);
    
    return { token: await this.getJwtToken({user: user, zeus: zeus}) };
    //TODO: retornar el JWT
  }

  public async getOficinaZeusPro(idOficina: number) : Promise<ZeusResponseDto>
  {
    const data = await this.http.get<ZeusDto>(`${this.configService.get('URL_ZEUS')}/api/oficina/getOficina/${idOficina}`);
    return {
      id_oficina: data.idOficina,
      descripcion: data.descripcion,
      id_ente: data.idEnte,
      ente: data.ente,
      id_departamento: data.idDepartamento,
      departamento: data.departamento,
      id_municipio: data.idMunicipio,
      municipio: data.municipio
    };
  }

  private async getJwtToken(payload: JwtPayload ) {
    const token = await this.jwtService.signAsync( payload );
    
    return token;

  }

  async buscarSegip(segipDto: SegipDto): Promise<SegipRespondeDto> {
    try {
      segipDto.ciUsuario = this.configService.get('SEGIP_USER')
      segipDto.aplicacion = this.configService.get('SEGIP_APP')
      const datosSegip = await fetch(this.configService.get('URL_SEGIP'), {
        method: 'POST',
        body: JSON.stringify(segipDto),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await datosSegip.json();
      
      
      // if (data.cedulaIdentidad == null) {
        return {
          ci: data.cedulaIdentidad,
          nombres: data.nombres,
          paterno: data.paterno,
          materno: data.materno,
          domicilio: data.domicilio,
          mensaje: data.mensaje,
          estado: data.estado
        };
      // }
    } catch (error) {
      console.log(error);
      this.handleDBExpeptions(error);
    }
  }
  
  private handleDBExpeptions(error: any) {
    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)     
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
