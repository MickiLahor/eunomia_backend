import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

  getStaticExcusaFile(fileName: string) {

    const path = join(__dirname,'../../static/excusa',fileName);
    if( !existsSync(path) )
    throw new BadRequestException(`No existe excusa de ${fileName}`);

    return path;

  }

  getStaticInformeFile(fileName: string) {

    const path = join(__dirname,'../../static/informe',fileName);
    if( !existsSync(path) )
    throw new BadRequestException(`No existe el informe de ${fileName}`);

    return path;
  }
}
