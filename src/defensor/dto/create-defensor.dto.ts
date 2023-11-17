import { IsDate, IsDateString, IsEmail, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateDefensorDto {
    @IsString()
    @MinLength(1)
    direccion_oficina: string;

    @IsString()
    @MinLength(1)
    telefono_oficina: string;

    @IsString()
    @MinLength(1)
    celular: string;

    @IsString()
    @MinLength(1)
    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(1)
    matricula: string;

    @IsNumber()
    id_departamento: number;
    
    @IsNumber()
    id_ciudad: number;

    @IsDateString()
    fecha_posesion: Date;

    @IsString()
    @IsUUID()
    id_persona: string;

    @IsString()
    @IsUUID()
    id_materia: string;

    @IsString()
    // @MinLength(1)
    usuario_registro: string;
}
