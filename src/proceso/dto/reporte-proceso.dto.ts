import { Type } from "class-transformer";
import { IsDateString, IsOptional } from "class-validator";

export class ReporteProcesoDto {
    
    @IsOptional()
    @Type(() => String )
    nurej?: string;

    @IsOptional()
    @Type(() => String )
    materia?: string;

    @IsOptional()
    @Type(() => Number )
    departamento?: number;

    @IsOptional()
    // @IsDateString()
    fecha_inicio?: Date;

    @IsOptional()
    // @IsDateString()
    fecha_fin?: Date;
}