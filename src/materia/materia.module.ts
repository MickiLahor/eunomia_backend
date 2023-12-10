import { Module } from '@nestjs/common';

import { MateriaController } from './controller/materia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { MateriaService } from './service/materia.service';
import { Proceso } from 'src/proceso/entities/proceso.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MateriaController],
  providers: [MateriaService],
  imports: [
    TypeOrmModule.forFeature([ Materia,Proceso ]),
    PassportModule,
    UsuariosModule,
    
  ],
  exports: [MateriaService]
})
export class MateriaModule {}
