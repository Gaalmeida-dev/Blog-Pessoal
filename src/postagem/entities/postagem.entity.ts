import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "tb_postagens" }) //CREATE TABLE tb_postagens
export class Postagem {

    @PrimaryGeneratedColumn()
    id: number;

    // Remove espaços em branco extras antes de validar/salvar
    @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty() //força digitação
    @Column({ length: 100, nullable: false })
    titulo: string;

    @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    @Column({ length: 1000, nullable: false }) //VARVHAR notnull
    texto: string;

    // Define automaticamente a data de criação no banco de dados
    @UpdateDateColumn()
    data: Date;
}