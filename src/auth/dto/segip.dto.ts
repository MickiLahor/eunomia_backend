import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class SegipDto {

    @IsNotEmpty()
    @IsString()
    readonly ciConsulta: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @IsOptional()
    ciUsuario: string;
    
    @IsString()
    @MaxLength(70)
    @IsOptional()
    readonly nombre?: string;
  
    @IsString()
    @MaxLength(70)
    @IsOptional()
    readonly paterno?: string;
  
    @IsString()
    @MaxLength(70)
    @IsOptional()
    readonly materno?: string;
  
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    aplicacion: string;
  
    // constructor (ciConsulta?: string, ciUsuario?: string, aplicacion?: string) {
    //   this.ciConsulta = ciConsulta;
    //   this.ciUsuario = ciUsuario;
    //   this.nombre = "";
    //   this.paterno = "";
    //   this.materno = "";
    //   this.aplicacion = aplicacion;
    // }
}

export class SegipRespondeDto {

    @IsNotEmpty()
    @IsString()
    readonly ci: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @MinLength(1)
    readonly nombres: string;
    
    @IsString()
    @MaxLength(70)  
    readonly paterno: string;

    @IsString()
    @MaxLength(70)  
    readonly materno: string;

    @IsString()
    @MaxLength(200)  
    readonly domicilio: string;

    @IsString()
    @MaxLength(200)  
    readonly mensaje: string;

    @IsNumber() 
    readonly estado: number;

}