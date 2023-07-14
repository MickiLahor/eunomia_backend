import { Usuario } from "src/usuarios/entities/usuario.entity";

    export interface JwtPayload {
        user: Usuario;
    }