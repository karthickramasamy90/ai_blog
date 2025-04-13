import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: "http://localhost:3000", // Allow frontend requests
    credentials: true, // Allow cookies if needed
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
  });

  // app.use((req, res, next) => {
  //   console.log('Incoming Request:', req.method, req.url);
  //   console.log('Authorization Header:', req.headers.authorization);
  //   next();
  // });

  await app.listen(3001);
}
bootstrap();
config();
