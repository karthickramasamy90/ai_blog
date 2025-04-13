import { Controller, Post, Get, Delete, Param, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface AuthRequest extends Request {
    user?: { id: number }; // ✅ Ensure TypeScript knows about `user`
  }

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':blogId')
  createComment(@Req() req: AuthRequest, @Param('blogId') blogId: string, @Body() body: { content: string }) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.commentService.createComment(req.user.id, Number(blogId), body.content);
  }

  @Get(':blogId')
  getComments(@Param('blogId') blogId: string) {
    return this.commentService.getCommentsByBlog(Number(blogId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteComment(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.commentService.deleteComment(Number(id), req.user['id']);
  }
}
