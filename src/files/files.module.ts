import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ExcusaModule } from 'src/excusa/excusa.module';
import { InformeModule } from 'src/informe/informe.module';


@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, ExcusaModule, InformeModule]
})
export class FilesModule {}
