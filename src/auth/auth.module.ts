import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PersonaModule } from 'src/persona/persona.module';
import { CommonModule } from 'src/common/common.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:
        [
          ConfigModule,
          CommonModule,
          RolesModule,
          TypeOrmModule.forFeature([ Usuario ]),
          PassportModule.register( { defaultStrategy: 'jwt' } ),
          JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => {
              return {
                secret: configService.get('JWT_SECRET'),
                     signOptions: {
                      expiresIn:'365d'
                    }
              }
            }
          }),
          forwardRef(() => PersonaModule),
        ],
        exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
