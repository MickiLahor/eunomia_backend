import { IsBoolean, IsDate, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePermisoDto {
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
