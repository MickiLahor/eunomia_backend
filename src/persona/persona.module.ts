import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Defensor } from 'src/defensor/entities/defensor.entity';

@Module({
  controllers: [PersonaController],
  providers: [PersonaService],
  imports:[TypeOrmModule.forFeature([ Persona, Defensor ])],
  exports: [PersonaService]
})
export class PersonaModule {}
