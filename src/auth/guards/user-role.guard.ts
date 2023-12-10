import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { RolesService } from 'src/roles/service/roles.service';
import { UsuariosService } from 'src/usuarios/service/usuarios.service';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly usuariosService: UsuariosService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES,context.getHandler())
    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as Usuario;
    const userValidate = await this.usuariosService.findOneSimple(user.id)
    if( !user )
    throw new BadRequestException('Usuario no encontrado');
    for (const role of userValidate.roles) {
      if (validRoles.includes(role.descripcion)) 
      {
        return true;
      }
    }
    throw new ForbiddenException(
    `Usuario ${userValidate.persona.nombre} requiere validar los roles: [${ validRoles }]`
    );
  }
}
