import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoExcusaDto } from './create-tipo-excusa.dto';

export class UpdateTipoExcusaDto extends PartialType(CreateTipoExcusaDto) {}
