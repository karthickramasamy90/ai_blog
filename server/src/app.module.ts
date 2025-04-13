import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [UsersModule, PrismaModule, BlogModule, AuthModule, CommentModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
