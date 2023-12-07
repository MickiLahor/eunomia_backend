import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";


export class CreateNotificacionDto {

  @IsString()
  @IsUUID()
  id_asignacion: string;
  
  @IsBoolean()
  @IsOptional()
  notificado_correo: boolean;

  @IsDateString()
  @IsOptional()
  fecha_correo: Date;

  @IsBoolean()
  @IsOptional()
  notificado_sms: boolean;

  @IsDateString()
  @IsOptional()
  fecha_sms: Date;

  @IsString()
  usuario_registro: string;
}
