import { IsDate, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateAsignacionEstadoDto {
    @IsDate()
    fecha: Date;

    @IsString()
    @IsUUID()
    id_asignacion: string;

    @IsString()
    @IsUUID()
    id_estado: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
