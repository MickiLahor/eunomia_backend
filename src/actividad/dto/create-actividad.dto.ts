import { IsBoolean, IsDateString, IsString, IsUUID, MinLength } from "class-validator";

export class CreateActividadDto {
  @IsString()
  @MinLength(1)
  descripcion: string

  @IsDateString()
  fecha_inicio: Date;

  @IsDateString()
  fecha_fin: Date;

  @IsBoolean()
  finalizado: boolean;

  @IsString()
  @MinLength(1)
  usuario_registro: string;

  @IsString()
  @IsUUID()
  id_asignacion: string;
}
