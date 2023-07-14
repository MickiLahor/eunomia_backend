import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class SearchDto {
    
    @IsOptional()
    @Type(() => String )
    ci?: string;

    @IsOptional()
    @Type(() => String )
    nombre?: string;

    @IsOptional()
    @Type(() => String )
    paterno?: string;

    @IsOptional()
    @Type(() => String )
    materno?: string;

    @IsOptional()
    @Type(() => Number )
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number )
    page?: number;
}

export class SearchUsuarioDto {
    
    @IsOptional()
    @Type(() => String )
    ci?: string;

    @IsOptional()
    @Type(() => String )
    usuario?: string;

    @IsOptional()
    @Type(() => String )
    nombres?: string;

    @IsOptional()
    @Type(() => String )
    rol?: string;

    @IsOptional()
    @Type(() => Number )
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number )
    page?: number;
}

export class SearchProcesoDto {
    
    @IsOptional()
    @Type(() => String )
    nurej?: string;

    @IsOptional()
    @Type(() => String )
    demandante?: string;

    @IsOptional()
    @Type(() => String )
    demandado?: string;

    @IsOptional()
    @Type(() => Number )
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number )
    page?: number;
}

export class SearchDefendorDto {
    
    @IsOptional()
    @Type(() => String )
    matricula?: string;

    @IsOptional()
    @Type(() => String )
    nombreCompleto?: string;

    @IsOptional()
    @Type(() => Number )
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number )
    page?: number;
}