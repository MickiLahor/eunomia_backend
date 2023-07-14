import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { PersonaModule } from './persona/persona.module';
import { DefensorModule } from './defensor/defensor.module';
import { MateriaModule } from './materia/materia.module';
import { ProcesoModule } from './proceso/proceso.module';
import { AsignacionModule } from './asignacion/asignacion.module';
import { TipoExcusaModule } from './tipo-excusa/tipo-excusa.module';
import { ExcusaModule } from './excusa/excusa.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { InformeModule } from './informe/informe.module';
import { TipoInformeModule } from './tipo_informe/tipo_informe.module';

@Module({
  imports: [ ConfigModule.forRoot(),
              TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                database: process.env.DB_NAME,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                autoLoadEntities: true,
                synchronize: true,
              }),
              CommonModule,
              SeedModule,
              UsuariosModule,
              RolesModule,
              PermisosModule,
              PersonaModule,
              DefensorModule,
              MateriaModule,
              ProcesoModule,
              AsignacionModule,
              TipoExcusaModule,
              ExcusaModule,
              AuthModule,
              FilesModule,
              InformeModule,
              TipoInformeModule,]
})
export class AppModule {}
