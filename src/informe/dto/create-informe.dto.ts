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
    id_asignacion: string;

    @IsString()
    @IsUUID()
    @MinLength(1)
    id_tipo_informe: string;


    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
