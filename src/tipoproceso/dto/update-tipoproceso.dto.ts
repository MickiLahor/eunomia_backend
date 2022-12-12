import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoProcesoDto } from './create-tipoproceso.dto';

export class UpdateTipoProcesoDto extends PartialType(CreateTipoProcesoDto) {}
