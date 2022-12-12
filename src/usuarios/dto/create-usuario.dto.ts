import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @MinLength(1)
    usuario: string;

    @IsString()
    @MinLength(1)
    clave: string;

    @IsNumber()
    idOficina: number;

    @IsNumber()
    idCiudad: number;

    @IsString()
    @IsUUID()
    idPersona: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}
