import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuario } from "../../usuarios/entities/usuario.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {


    constructor(
        @InjectRepository( Usuario )
        private readonly userRepository: Repository<Usuario>,
        configService: ConfigService
    ) {
        super( {
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        } );
    }

    async validate( payload: JwtPayload ): Promise<Usuario> {
        
        const { user } = payload;

        const usuario = await this.userRepository.findOneBy({ id:user.id });

        if(!usuario) 
         throw new UnauthorizedException('Token no valido.')
        if(!usuario.registroActivo)
        throw new UnauthorizedException('Usuario inhabilitado.')

        return usuario;
    }

}