import { Module } from '@nestjs/common';

import { MateriaController } from './materia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { MateriaService } from './materia.service';
import { Proceso } from 'src/proceso/entities/proceso.entity';

@Module({
  controllers: [MateriaController],
  providers: [MateriaService],
  imports: [TypeOrmModule.forFeature([ Materia,Proceso ])],
  exports: [MateriaService]
})
export class MateriaModule {}
