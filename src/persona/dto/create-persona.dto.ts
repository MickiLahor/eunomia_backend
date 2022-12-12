import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePersonaDto {
    @IsString()
    @MinLength(1)
    ci: string;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @IsOptional()
    paterno: string;

    @IsString()
    @IsOptional()
    materno: string;

    @IsString()
    @MinLength(1)
    @MaxLength(1)
    sexo: string;

    @IsString()
    @IsOptional()
    fotografia: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
}