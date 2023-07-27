import { IsDate, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEstadoDto {
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsDate()
    @IsOptional()
    fecha?: Date;

    @IsString()
    @MinLength(1)
    usuario_registro: string;

}
