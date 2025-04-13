import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Req, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

import { BlogService } from './blog.service';
import { AuthenticatedRequest } from "../auth/authenticated-request"; // ✅ Import custom type
import { SaveBlogDto } from './dto/blog.dto';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  
  // Get all blog posts
  @Get()
  @UseGuards(AuthGuard('jwt')) // 🔒 Protects route
  getAllBlogs(@Request() req) {
    console.log('User:', req.user); // Logs the authenticated user
    return this.blogService.getAllBlogs();
  }

  // @Get()
  // @UseGuards(AuthGuard('jwt')) // Any authenticated user can access
  // getAllBlogs() {
  //   return [{ id: 1, title: 'Blog Post' }];
  // }

  // Create a blog post
  @Post()
  @UseGuards(AuthGuard('jwt')) // 🔒 Only logged-in users can create blogs
  @Roles('ADMIN') // Only admin can create blogs
  createBlog(@Request() req, @Body() blogData: { title: string; content: string; authorId: number }) {
    return this.blogService.createBlog({
      title: blogData.title,
      content: blogData.content,
      authorId: req.user.userId, // Gets the user ID from the JWT payload
    });
  }

  // Get a single blog post by ID
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(Number(id));
  }

  // Update a blog post
  // @Patch(':id')
  // async updateBlog(@Param('id') id: string, @Body() blogData: { title?: string; content?: string }) {
  //   return this.blogService.updateBlog(Number(id), blogData);
  // }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateBlog(@Param('id') id: string, @Body() blogData: { title?: string; content?: string }) {
    return this.blogService.updateBlog(Number(id), blogData);
  }

  // Delete a blog post
  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(Number(id));
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('generate')
  // async generateBlog(@Body() body: { topic: string }, @Request() req) {
  // const userId = req.user?.userId; // ✅ Get user ID from request
  // if (!userId) {
  //   throw new UnauthorizedException("User must be logged in to generate a blog.");
  // }

  //   return this.blogService.generateAndSaveBlog(body.topic, userId); // ✅ Pass userId
  // }

  @Post("generate")
  @UseGuards(AuthGuard("jwt"))
  async generateBlog(@Body() body: { topic: string }, @Request() req) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException("User not authenticated");

    const generatedContent = await this.blogService.generateAndSaveBlog(body.topic, userId); // Call AI service

    return { blogContent: generatedContent };
  }

  @Post('save-generated')
  @UseGuards(AuthGuard('jwt')) // Ensure only logged-in users can save
  async saveGeneratedBlog(@Req() req: AuthenticatedRequest, @Body() body: SaveBlogDto) {
      const authorId = req.user.userId;
      const savedBlog = await this.blogService.createBlog({ 
          title: body.title, 
          content: body.content, 
          authorId, 
          isGenerated: true 
      });

    return savedBlog;
  }
}
