import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port: number = Number(process.env.PORT);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle(`API "${process.env.API_NAME}" дукументация`)
    .setVersion(`${process.env.API_VERSION}`)
    .addTag('API')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);


  await app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log('Server has been started on %j port', port);
  });
}
bootstrap();
