import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Postagem } from '../entities/postagem.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { TemaService } from '../../tema/services/tema.service';

@Injectable()
export class PostagemService {
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        private readonly temaService: TemaService
    ) {}

    async findAll(): Promise<Postagem[]> {
        // SELECT * FROM tb_postagens;
        return this.postagemRepository.find({
            relations:{
                tema: true,
                usuario: true
            }
        });
    }

    async findById(id: number): Promise<Postagem> {
        // SELECT * FROM tb_postagens WHERE id = ?;
        const postagem = await this.postagemRepository.findOne({
            where: {
                id,
            },
            relations:{
                tema: true,
                usuario: true
            }
        });

        if (!postagem) throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

        return postagem;
    }

    async findAllByTitulo(titulo: string): Promise<Postagem[]> {
        // SELECT * FROM tb_postagens WHERE titulo LIKE '%?%';
        return this.postagemRepository.find({
            where: {
                titulo: ILike(`%${titulo}%`),
            },
            relations:{
                tema: true,
                usuario: true
            }
        });
    }

    async create(postagem: Postagem): Promise<Postagem> {

        await this.temaService.findById(postagem.tema.id);

        // INSERT INTO tb_postagens (titulo, texto) VALUES (?, ?);
        return this.postagemRepository.save(postagem);
    }

    async update(postagem: Postagem): Promise<Postagem> {
        if (!postagem.id || postagem.id <= 0)
            throw new HttpException('O ID da postagem é inválido!', HttpStatus.BAD_REQUEST);

        // Checa se a Postagem existe
        await this.findById(postagem.id);

        // Checa se o Tema da Postagem existe
        await this.temaService.findById(postagem.tema.id);

        // UPDATE tb_postagens SET titulo = ?,
        // texto = ? ,
        // data = CURRENT_TIMESTAMP()
        // WHERE id = ?;
        return this.postagemRepository.save(postagem);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        // DELETE tb_postagens FROM id = ?;
        return this.postagemRepository.delete(id);
    }
}