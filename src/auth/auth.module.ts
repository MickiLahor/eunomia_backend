import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PersonaModule } from 'src/persona/persona.module';
import { CommonModule } from 'src/common/common.module';
import { RolesModule } from 'src/roles/roles.module';
import { DefensorModule } from 'src/defensor/defensor.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:
        [
          ConfigModule,
          forwardRef(() => CommonModule),
          RolesModule,
          TypeOrmModule.forFeature([ Usuario ]),
          PassportModule.register( { defaultStrategy: 'jwt' } ),
          JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => {
              return {
                secret: configService.get('JWT_SECRET'),
                global:true,
                      signOptions: {
                      expiresIn: configService.get('TOKEN_EXPIRES'),
                      algorithm: configService.get('SIGN_ALGORITHM'),
                    }
              }
            }
          }),
          forwardRef(() => PersonaModule),
          forwardRef(() => UsuariosModule),
          forwardRef(() => DefensorModule)
        ],
        exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
