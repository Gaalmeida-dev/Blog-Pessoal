import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function SwaggerConfig(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Blog Pessoal')
        .setDescription('Projeto Blog Pessoal - Generation Brasil')
        .setContact(
            'Gabriela Almeida',
            'https://github.com/Gaalmeida-dev',
            'gabriela@email.com'
        )
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger', app, document);
}