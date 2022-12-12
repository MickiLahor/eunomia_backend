import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class LoginUsuarioDto {
    @IsString()
    @MinLength(1)
    usuario: string;

    @IsString()
    @MinLength(1)
    clave: string;
}
