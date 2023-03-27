import { Module } from '@nestjs/common';
import { DefensorService } from './defensor.service';
import { DefensorController } from './defensor.controller';
import { Defensor } from './entities/defensor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from 'src/persona/entities/persona.entity';
import { PersonaModule } from 'src/persona/persona.module';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { MateriaModule } from 'src/materia/materia.module';
import { Materia } from 'src/materia/entities/materia.entity';

@Module({
  controllers: [DefensorController],
  providers: [DefensorService],
  imports: [TypeOrmModule.forFeature([ Defensor, Persona, Asignacion, Materia ]),
            PersonaModule, MateriaModule],
  exports:[DefensorService]
})
export class DefensorModule {}
