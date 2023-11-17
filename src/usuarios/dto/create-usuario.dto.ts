import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUsuarioDto {
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

    @IsNumber()
    id_departamento: number;

    @IsString()
    @IsUUID()
    id_persona: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
