import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NoCacheInterceptor, ResponseInterceptor } from '@interceptors';
import * as bodyParser from 'body-parser';
import { c } from '@emx/core';
import {
  NotFoundFilter,
  PrismaClientExceptionFilter,
  ResponseExceptionFilter,
  UnauthorizedExceptionFilter,
} from '@filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn'],
  });
  const port = 4990;
  const globalPrefix = 'api';
  app.use(
    bodyParser.raw({
      type: 'application/x-msgpack',
      limit: '20gb', // Tùy chỉnh limit
    })
  );

  app.enableCors({});
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(
    new ResponseExceptionFilter(),
    new PrismaClientExceptionFilter(),
    new NotFoundFilter(),
    new UnauthorizedExceptionFilter()
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new NoCacheInterceptor(), new ResponseInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Shop app api')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
  console.log(
    c.green`🚀 Application is running on:`,
    c.blueBright.underline(`http://localhost:${port}/${globalPrefix}`)
  );
}

void bootstrap();
