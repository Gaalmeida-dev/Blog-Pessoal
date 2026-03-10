import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tema } from '../entities/tema.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class TemaService {
    constructor(
        @InjectRepository(Tema)
        private temaRepository: Repository<Tema>,
    ) {}

    async findAll(): Promise<Tema[]> {
        return this.temaRepository.find({
            relations:{
                postagem: true
            }
        });
    }

    async findById(id: number): Promise<Tema> {
        const tema = await this.temaRepository.findOne({
            where: {
                id,
            },
            relations:{
                postagem: true
            }
        });

        if (!tema) throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);

        return tema;
    }

    async findAllByDescricao(descricao: string): Promise<Tema[]> {
        return this.temaRepository.find({
            where: {
                descricao: ILike(`%${descricao}%`),
            },
            relations:{
                postagem: true
            }
        });
    }

    async create(tema: Tema): Promise<Tema> {
        return this.temaRepository.save(tema);
    }

    async update(tema: Tema): Promise<Tema> {
        if (!tema.id || tema.id <= 0)
            throw new HttpException('O ID do tema é inválido!', HttpStatus.BAD_REQUEST);

        await this.findById(tema.id);

        return this.temaRepository.save(tema);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return this.temaRepository.delete(id);
    }
}