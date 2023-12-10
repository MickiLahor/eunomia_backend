import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { CommonController } from './common.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
    providers: [AxiosAdapter,CommonService],
    exports: [AxiosAdapter,CommonService],
    imports: [ConfigModule, UsuariosModule],
    controllers:[CommonController]
})
export class CommonModule {}
