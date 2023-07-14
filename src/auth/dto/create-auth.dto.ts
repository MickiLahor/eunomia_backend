import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateAuthDto {
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

export class ResetPasswordUserDto {
    @IsString()
    @IsUUID()
    idUsuario: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}