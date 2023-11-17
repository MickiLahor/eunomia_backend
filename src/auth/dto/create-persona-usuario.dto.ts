import { IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreatePersonaUsuarioDto {
    
    @IsString()
    @MinLength(1)
    ci: string;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @IsOptional()
    paterno: string;

    @IsString()
    @IsOptional()
    materno: string;

    @IsString()
    @MinLength(1)
    @MaxLength(1)
    sexo: string;

    @IsString()
    @IsOptional()
    fotografia: string;

    @IsNumber()
    @IsOptional()
    id_oficina: number;

    @IsNumber()
    id_ciudad: number;

    @IsNumber()
    id_departamento: number;

    @IsString({each:true})
    @IsArray()
    roles: string[];

    @IsString()
    @IsOptional()
    id_materia: string;

    @IsString()
    @IsOptional()
    direccion_oficina: string;

    @IsString()
    @IsOptional()
    telefono_oficina: string;

    @IsString()
    @IsOptional()
    celular: string;

    @IsString()
    @IsOptional()
    correo: string;

    @IsString()
    @IsOptional()
    matricula: string;

    @IsDateString()
    @IsOptional()
    fecha_posesion: Date;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
