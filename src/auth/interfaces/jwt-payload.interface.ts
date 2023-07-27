import { Usuario } from "src/usuarios/entities/usuario.entity";
import { ZeusResponseDto } from "../dto/zeus-response.dto";

    export interface JwtPayload {
        user: Usuario;
        zeus: ZeusResponseDto;
    }