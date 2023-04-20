import { IsDate, IsDateString, IsEmail, IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateDefensorDto {
    @IsString()
    @MinLength(1)
    direccionOficina: string;

    @IsString()
    @MinLength(1)
    telefonoOficina: string;

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
    idOficina: number;

    @IsNumber()
    idCiudad: number;

    @IsDateString()
    fechaPosesion: Date;

    @IsString()
    @IsUUID()
    idPersona: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    idMateria: string;


    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}
