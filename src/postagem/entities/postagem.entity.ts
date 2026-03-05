import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "tb_postagens" }) //CREATE TABLE tb_postagens
export class Postagem {

    @PrimaryGeneratedColumn()
    id: number;

    // Remove espaços em branco extras antes de validar/salvar
    @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty() //força digitação
    @Length(5, 100, {message: "O texto deve ter entre 5 e 100 caracteres"})
    @Column({ length: 100, nullable: false })
    titulo: string;

    @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    @Length(10, 1000, {message: "O texto deve ter entre 10 e 1000 caracteres"})
    @Column({ length: 1000, nullable: false }) //VARVHAR notnull
    texto: string;

    // Define automaticamente a data de criação no banco de dados
    @UpdateDateColumn()
    data: Date;
}