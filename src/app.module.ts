import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { Tema } from './tema/entities/tema.entity';
import { Postagem } from './postagem/entities/postagem.entity';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.modulo';
import { TemaModule } from './tema/tema.module';
import { PostagemModule } from './postagem/postagem.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: (process.env.NODE_ENV === 'production' ? 'postgres' : 'mysql') as any,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [Usuario, Tema, Postagem],
            synchronize: true,
            ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
        }),
        AuthModule,
        UsuarioModule,
        TemaModule,
        PostagemModule,
    ],
})
export class AppModule {}
