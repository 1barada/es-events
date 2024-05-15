import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseValidationInterceptor } from './response.interceptor';
import { ErrorFilter } from './errors.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      return new BadRequestException(errors.reduce<string[]>((acc, cur) => {
        if (cur.constraints) acc.push(...Object.values(cur.constraints));
        return acc;
      }, []));
    },
    stopAtFirstError: true
  }));
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalInterceptors(new ResponseValidationInterceptor());
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: '*'
  });
  await app.listen(3000);
}
bootstrap();
