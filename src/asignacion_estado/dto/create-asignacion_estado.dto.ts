import { IsBoolean, IsDate, IsDateString, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateAsignacionEstadoDto {
    @IsDate()
    fecha: Date;

    @IsString()
    @IsUUID()
    id_asignacion: string;

    @IsString()
    @IsUUID()
    id_estado: string;

    @IsBoolean()
    vigente: boolean;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}

export class CreateApersonamientoDefensorDto {
    // @IsDate()
    @IsDateString()
    fecha: Date;

    @IsString()
    @IsUUID()
    id_asignacion: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
