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
      type: process.env.DATABASE_URL ? 'postgres' : 'mysql',
      url: process.env.DATABASE_URL, 
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'db_blogpessoal', 
      entities: [Usuario, Tema, Postagem],
      synchronize: true,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
        AuthModule,
        UsuarioModule,
        TemaModule,
        PostagemModule,
    ],
})
export class AppModule {}
