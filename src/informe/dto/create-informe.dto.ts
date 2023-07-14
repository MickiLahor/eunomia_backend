import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateInformeDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    archivo?: string;

    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    idAsignacion: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    idTipoInforme: string;


    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}
