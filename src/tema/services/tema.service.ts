import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, DeleteResult } from "typeorm";
import { Tema} from "../entities/tema.entity";

@Injectable()
export class TemaService {
    
    constructor(
        @InjectRepository(Tema)
        private temaRepository: Repository<Tema>,
    ){}

    async findAll(): Promise<Tema[]> {
        return await this.temaRepository.find(); // SELECT * FROM tb_tema
    }

    async findById(id: number): Promise<Tema> {
        // SELECT * FROM tb_tema WHERE id = ?;
        const tema = await this.temaRepository.findOne({
            where: {
                id
            }
        });

        if (!tema) {
            throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
        }

        return tema;
    }

    async findAllByDescricao(descricao: string): Promise<Tema[]> {
        // SELECT * FROM tb_tema WHERE titulo LIKE '%descricao%';
        return await this.temaRepository.find({
            where: {
                descricao: ILike(`%${descricao}%`) // Busca flexível (ignora case e busca partes do texto)
            }
        });
    }

    async create(postagem: Tema): Promise<Tema>{
        //INSERT INTO tb_tema (titulo, texto) VALUES (?, ?);
        return await this.temaRepository.save(postagem);
    }

    async update(postagem: Tema): Promise<Tema> {
        if (!postagem.id || postagem.id <= 0)
            throw new HttpException("O ID do tema é inválido!", HttpStatus.BAD_REQUEST);

        await this.findById(postagem.id);

        return this.temaRepository.save(postagem);
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id);

        //DELETE tb_postagens FROM id = ?;
        return this.temaRepository.delete(id);
    }
}