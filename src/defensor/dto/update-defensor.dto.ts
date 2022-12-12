import { PartialType } from '@nestjs/mapped-types';
import { CreateDefensorDto } from './create-defensor.dto';

export class UpdateDefensorDto extends PartialType(CreateDefensorDto) {}
