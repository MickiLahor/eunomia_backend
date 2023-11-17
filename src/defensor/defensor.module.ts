import { Module, forwardRef } from '@nestjs/common';
import { DefensorService } from './service/defensor.service';
import { DefensorController } from './controller/defensor.controller';
import { Defensor } from './entities/defensor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from 'src/persona/entities/persona.entity';
import { PersonaModule } from 'src/persona/persona.module';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { MateriaModule } from 'src/materia/materia.module';
import { Materia } from 'src/materia/entities/materia.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [DefensorController],
  providers: [DefensorService],
  imports: [TypeOrmModule.forFeature([ Defensor, Persona, Asignacion, Materia ]),
            forwardRef(() => CommonModule),
            PersonaModule, MateriaModule],
  exports:[DefensorService]
})
export class DefensorModule {}
