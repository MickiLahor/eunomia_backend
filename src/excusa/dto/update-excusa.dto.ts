import { PartialType } from '@nestjs/mapped-types';
import { CreateExcusaDto } from './create-excusa.dto';

export class UpdateExcusaDto extends PartialType(CreateExcusaDto) {}
