import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ExcusaModule } from 'src/excusa/excusa.module';
import { InformeModule } from 'src/informe/informe.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';


@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule, 
    ExcusaModule, 
    InformeModule,
    UsuariosModule
  ]
})
export class FilesModule {}
