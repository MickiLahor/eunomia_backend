import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @MinLength(1)
    usuario: string;

    @IsString()
    @MinLength(1)
    clave: string;

    @IsNumber()
    id_oficina: number;

    @IsNumber()
    id_ciudad: number;

    @IsString()
    @IsUUID()
    id_persona: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}

export class ResetPasswordUserDto {
    @IsString()
    @IsUUID()
    id_usuario: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}