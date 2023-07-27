import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsString()
    @MinLength(1)
    usuario_registro: string;
    
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    permisos?: string[];
}
