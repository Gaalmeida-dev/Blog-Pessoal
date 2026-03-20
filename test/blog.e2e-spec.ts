import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { UsuarioModule } from '../src/usuario/usuario.modulo';
import { TemaModule } from '../src/tema/tema.module';
import { PostagemModule } from '../src/postagem/postagem.module';
import { Usuario } from '../src/usuario/entities/usuario.entity';
import { Tema } from '../src/tema/entities/tema.entity';
import { Postagem } from '../src/postagem/entities/postagem.entity';

describe('Testes dos Módulos Blog (e2e)', () => {

    let app: INestApplication;
    let token: string;
    let usuarioId: number;
    let temaId: number;
    let postagemId: number;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                entities: [Usuario, Tema, Postagem],
                synchronize: true,
                dropSchema: true,
            }),
            AuthModule,       
            UsuarioModule,    
            TemaModule,
            PostagemModule,
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
});
    afterAll(async () => {
        await app.close();
    });

    // ==========================================
    // TESTES DE USUÁRIO
    // ==========================================

    it('01 - Deve Cadastrar Usuário', async () => {
        const resposta = await request(app.getHttpServer())
            .post('/usuarios/cadastrar')
            .send({
                nome: 'Root',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: 'https://i.imgur.com/FETvs2O.jpg',
            });

        expect(resposta.status).toBe(201);
        usuarioId = resposta.body.id;
    });

    it('02 - Não Deve Cadastrar Usuário Duplicado', async () => {
        const resposta = await request(app.getHttpServer())
            .post('/usuarios/cadastrar')
            .send({
                nome: 'Root',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: 'https://i.imgur.com/FETvs2O.jpg',
            });

        expect(resposta.status).toBe(400);
    });

it('03 - Deve Autenticar Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer())
        .post('/usuarios/logar')
        .send({
            usuario: 'root@root.com',
            senha: 'rootroot',
        });

    console.log('TOKEN:', resposta.body.token); // ← debug temporário
    expect(resposta.status).toBe(200);
    expect(resposta.body.token).toBeDefined();
    token = resposta.body.token;
});

it('04 - Deve Listar todos os Usuários', async () => {
    const jwtToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    const resposta = await request(app.getHttpServer())
        .get('/usuarios/all')  
        .set('Authorization', `Bearer ${jwtToken}`);

    expect(resposta.status).toBe(200);
});

    it('05 - Deve Atualizar um Usuário', async () => {
        const resposta = await request(app.getHttpServer())
            .put('/usuarios/atualizar')
            .set('Authorization', token)
            .send({
                id: usuarioId,
                nome: 'Root Atualizado',
                usuario: 'root@root.com',
                senha: 'rootroot123',
                foto: 'https://i.imgur.com/FETvs2O.jpg',
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body.nome).toBe('Root Atualizado');

        // Atualiza o token após mudar a senha
        const login = await request(app.getHttpServer())
            .post('/usuarios/logar')
            .send({ usuario: 'root@root.com', senha: 'rootroot123' });

        token = login.body.token;
    });

    // ==========================================
    // TESTES DE TEMA
    // ==========================================

    it('06 - Deve Criar um Tema', async () => {
        const resposta = await request(app.getHttpServer())
            .post('/temas')
            .set('Authorization', token)
            .send({
                descricao: 'Tecnologia',
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toBeDefined();
        temaId = resposta.body.id;
    });

    it('07 - Deve Listar todos os Temas', async () => {
        const resposta = await request(app.getHttpServer())
            .get('/temas')
            .set('Authorization', token);

        expect(resposta.status).toBe(200);
    });

    it('08 - Deve Buscar Tema por ID', async () => {
        const resposta = await request(app.getHttpServer())
            .get(`/temas/${temaId}`)
            .set('Authorization', token);

        expect(resposta.status).toBe(200);
        expect(resposta.body.id).toBe(temaId);
    });

    it('09 - Deve Atualizar um Tema', async () => {
        const resposta = await request(app.getHttpServer())
            .put('/temas')
            .set('Authorization', token)
            .send({
                id: temaId,
                descricao: 'Tecnologia e Programação',
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body.descricao).toBe('Tecnologia e Programação');
    });

    // ==========================================
    // TESTES DE POSTAGEM
    // ==========================================

    it('10 - Deve Criar uma Postagem', async () => {
        const resposta = await request(app.getHttpServer())
            .post('/postagens')
            .set('Authorization', token)
            .send({
                titulo: 'Meu primeiro post',
                texto: 'Conteúdo do meu primeiro post no blog!',
                foto: 'https://i.imgur.com/foto.jpg',
                tema: { id: temaId },
                usuario: { id: usuarioId },
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toBeDefined();
        postagemId = resposta.body.id;
    });

    it('11 - Deve Listar todas as Postagens', async () => {
        const resposta = await request(app.getHttpServer())
            .get('/postagens')
            .set('Authorization', token);

        expect(resposta.status).toBe(200);
    });

    it('12 - Deve Buscar Postagem por ID', async () => {
        const resposta = await request(app.getHttpServer())
            .get(`/postagens/${postagemId}`)
            .set('Authorization', token);

        expect(resposta.status).toBe(200);
        expect(resposta.body.id).toBe(postagemId);
    });

    it('13 - Deve Atualizar uma Postagem', async () => {
        const resposta = await request(app.getHttpServer())
            .put('/postagens')
            .set('Authorization', token)
            .send({
                id: postagemId,
                titulo: 'Meu primeiro post - Atualizado',
                texto: 'Conteúdo atualizado!',
                foto: 'https://i.imgur.com/foto.jpg',
                tema: { id: temaId },
                usuario: { id: usuarioId },
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body.titulo).toBe('Meu primeiro post - Atualizado');
    });

    it('14 - Deve Deletar uma Postagem', async () => {
        const resposta = await request(app.getHttpServer())
            .delete(`/postagens/${postagemId}`)
            .set('Authorization', token);

        expect(resposta.status).toBe(204);
    });

    it('15 - Deve Deletar um Tema', async () => {
        const resposta = await request(app.getHttpServer())
            .delete(`/temas/${temaId}`)
            .set('Authorization', token);

        expect(resposta.status).toBe(204);
    });
});
