import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsString()
    @MinLength(1)
    usuarioRegistro: string;
    
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    permisos?: string[];
}
