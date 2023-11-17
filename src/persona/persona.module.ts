import { Module, forwardRef } from '@nestjs/common';
import { PersonaService } from './service/persona.service';
import { PersonaController } from './controller/persona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Defensor } from 'src/defensor/entities/defensor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { CommonModule } from 'src/common/common.module';


@Module({
  controllers: [PersonaController],
  providers: [PersonaService],
  imports:[ 
              AuthModule,
              TypeOrmModule.forFeature([ Persona, Defensor ]),
              forwardRef(() => UsuariosModule),
              forwardRef(() => CommonModule)
          ],
  exports: [PersonaService]
})
export class PersonaModule {}
