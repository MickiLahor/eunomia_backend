import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateExcusaDto {
    @IsString()
    @MinLength(1)
    archivo: string;

    @IsString()
    @MinLength(1)
    motivo: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    idTipoExcusa: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    idAsignacion: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}
