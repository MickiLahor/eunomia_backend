import { Module, forwardRef } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Defensor } from 'src/defensor/entities/defensor.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';


@Module({
  controllers: [PersonaController],
  providers: [PersonaService],
  imports:[ 
              AuthModule,
              TypeOrmModule.forFeature([ Persona, Defensor ]),
              forwardRef(() => UsuariosModule)
          ],
  exports: [PersonaService]
})
export class PersonaModule {}
