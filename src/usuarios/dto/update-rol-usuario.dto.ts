import { IsArray, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateRolUsuarioDto {

    @IsString({each:true})
    @IsArray()
    roles: string[];
}
