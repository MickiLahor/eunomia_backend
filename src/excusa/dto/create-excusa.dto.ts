import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateExcusaDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    archivo?: string;

    @IsString()
    @MinLength(1)
    motivo: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    id_tipo_excusa: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    id_asignacion: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
