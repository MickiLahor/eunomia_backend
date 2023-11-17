import { Module } from '@nestjs/common';
import { TipoExcusaService } from './service/tipo-excusa.service';
import { TipoExcusaController } from './controller/tipo-excusa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoExcusa } from './entities/tipo-excusa.entity';
import { Excusa } from 'src/excusa/entities/excusa.entity';

@Module({
  controllers: [TipoExcusaController],
  providers: [TipoExcusaService],
  imports: [TypeOrmModule.forFeature([ TipoExcusa, Excusa])],
  exports: [TipoExcusaService]
})
export class TipoExcusaModule {}
