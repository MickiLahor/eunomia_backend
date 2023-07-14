import { IsString, MinLength } from "class-validator";

export class CreateTipoInformeDto {
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}
