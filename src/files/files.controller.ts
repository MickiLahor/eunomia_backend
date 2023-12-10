import { BadRequestException, Body, Controller, Get, Param, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateExcusaDto } from 'src/excusa/dto/create-excusa.dto';
import { ExcusaService } from 'src/excusa/service/excusa.service';
import { InformeService } from 'src/informe/service/informe.service';
import { CreateInformeDto } from 'src/informe/dto/create-informe.dto';
import { mkdirSync } from 'fs';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 10000000;

@Controller('files')
@Auth()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly excusaService: ExcusaService,
    private readonly informeService: InformeService,
    ) {}


  @Get('excusa/:imageName') 
  fineOne(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
      const path = this.filesService.getStaticExcusaFile(imageName);
      res.sendFile(path);
  }

  @Get('informe/:imageName') 
  fineOneInforme(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
      const path = this.filesService.getStaticInformeFile(imageName);
      res.sendFile(path);
  }


  @Post('excusa')
  @UseInterceptors( FileInterceptor('archivo', {
    fileFilter:fileFilter, 
    storage: diskStorage({
      destination: `./static/excusa`,
      filename: fileNamer
    })  
  } 
  ))
  async uploadFileExcusa(@UploadedFile(
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'pdf',
    })
    .addMaxSizeValidator({
      maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
    })
    .build({
      //errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) archivo: Express.Multer.File, @Body() body: CreateExcusaDto)
  {
    if( !archivo ){
      throw new BadRequestException('El archivo no es un pdf')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/excusa/${archivo.filename}`;
    body.archivo = secureUrl;

    return await this.excusaService.create(body);
  }

  @Post('informe')
  @UseInterceptors( FileInterceptor('archivo', {
    fileFilter:fileFilter, 
    storage: diskStorage({
      destination: './static/informe',
      filename: fileNamer
    })  
  } 
  ))
  async uploadFileInforme(@UploadedFile(
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'pdf',
    })
    .addMaxSizeValidator({
      maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
    })
    .build({
      //errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) archivo: Express.Multer.File, @Body() body: CreateInformeDto)
  {

    if( !archivo ){
      throw new BadRequestException('El archivo no es un pdf')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/informe/${archivo.filename}`;
    body.archivo = secureUrl;

    return await this.informeService.create(body);
  }
}
