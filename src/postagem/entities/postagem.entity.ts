import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'tb_postagens' }) // CREATE TABLE tb_postagens
export class Postagem {
    @PrimaryGeneratedColumn() // PRIMARY KEY(id) AUTO INCREMENT
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim()) // Remover espaços em branco I/F
    @IsNotEmpty({ message: 'O Título é Obrigatório' }) // Forçar digitação
    @Length(5, 100, { message: 'O Título deve ter entre 5 e 100 caracteres' })
    @Column({ length: 100, nullable: false }) // VARCHAR(100) NOT NULL
    titulo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim()) // Remover espaços em branco I/F
    @IsNotEmpty({ message: 'O Texto é Obrigatório' }) // Forçar digitação
    @Length(10, 1000, { message: 'O Texto deve ter entre 10 e 1000 caracteres' })
    @Column({ length: 1000, nullable: false }) // VARCHAR(1000) NOT NULL
    texto: string;

    @UpdateDateColumn() // Atualiza a data na criação e na atualização
    data: Date; // DATETIME(6)

    @ManyToOne( () => Tema, (tema) => tema.postagem, {
        onDelete: "CASCADE"
    })
    tema: Tema; // Representa a Chave Estrangeira

    @ManyToOne( () => Usuario, (usuario) => usuario.postagem, {
        onDelete: "CASCADE"
    })
    usuario: Usuario; // Representa a Chave Estrangeira
}