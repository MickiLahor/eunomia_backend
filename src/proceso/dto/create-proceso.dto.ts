import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateProcesoDto {
    @IsString()
    @MinLength(1)
    nurej: string;

    @IsString()
    @MinLength(1)
    demandante: string;

    @IsString()
    @MinLength(1)
    demandado: string;

    @IsNumber()
    @IsPositive()
    id_oficina: number;

    @IsNumber()
    @IsPositive()
    id_ciudad: number;

    @IsNumber()
    @IsPositive()
    id_departamento: number;

    @IsString()
    @IsUUID()
    @MinLength(1)
    id_materia: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
