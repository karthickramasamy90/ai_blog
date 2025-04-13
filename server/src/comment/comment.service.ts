import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: number, blogId: number, content: string) {
    return this.prisma.comment.create({
      data: { content, authorId: userId, blogId },
    });
  }

  async getCommentsByBlog(blogId: number) {
    return this.prisma.comment.findMany({
      where: { blogId },
      include: { author: { select: { email: true } } },
    });
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== userId) {
      throw new NotFoundException('Comment not found or unauthorized');
    }
    return this.prisma.comment.delete({ where: { id } });
  }
}
