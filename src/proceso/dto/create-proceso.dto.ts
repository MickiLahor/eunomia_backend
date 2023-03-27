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
    idOficina: number;

    @IsNumber()
    @IsPositive()
    idCiudad: number;

    @IsString()
    @IsUUID()
    @MinLength(1)
    idMateria: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}
