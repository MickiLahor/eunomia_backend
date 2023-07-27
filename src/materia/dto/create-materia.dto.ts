import { IsString, MinLength } from "class-validator";

export class CreateMateriaDto {
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
}
