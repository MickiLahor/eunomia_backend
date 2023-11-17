import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaUsuarioDto } from './create-persona-usuario.dto';

export class UpdatePersonaUsuarioDto extends PartialType(CreatePersonaUsuarioDto) {}
