import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "tb_tema" }) //CREATE TABLE tb_postagens
export class Tema {

    @PrimaryGeneratedColumn()
    id: number;

    // Remove espaços em branco extras antes de validar/salvar
    @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty() //força digitação
    @Length(5, 1000, {message: "O texto deve ter entre 5 e 1000 caracteres"})
    @Column({ length: 100, nullable: false })
    descricao: string;
    static id: any;

}