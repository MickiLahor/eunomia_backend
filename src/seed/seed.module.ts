import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MateriaModule } from 'src/materia/materia.module';
import { ProcesoModule } from 'src/proceso/proceso.module';
import { PersonaModule } from 'src/persona/persona.module';
import { DefensorModule } from 'src/defensor/defensor.module';
import { TipoExcusaModule } from 'src/tipo-excusa/tipo-excusa.module';
import { TipoInformeModule } from 'src/tipo_informe/tipo_informe.module';
@Module({
  controllers: [SeedController],
  providers: [SeedService],  
  imports:[MateriaModule, ProcesoModule, PersonaModule, DefensorModule, TipoExcusaModule, TipoInformeModule]
})
export class SeedModule {}
