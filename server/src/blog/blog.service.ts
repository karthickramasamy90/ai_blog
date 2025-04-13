import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  private genAI: GoogleGenerativeAI;
  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  // Create a new blog post
//   async createBlog(data: Prisma.BlogCreateInput) {
//     return this.prisma.blog.create({ data });
//   }

async generateAndSaveBlog(topic: string, authorId: number) {
    if (!authorId) {
      throw new Error("authorId is required to create a blog.");
    }
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Write a detailed blog post about "${topic}".`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
          title: topic,
          content: content,
          authorId: authorId,
        }

    // // ✅ Save the AI-generated blog in DB
    // return await this.prisma.blog.create({
    //   data: {
    //     title: topic,
    //     content: content,
    //     authorId: authorId,
    //     isGenerated: true,
    //   },
    // });
  }

  async createBlog(data: { title: string; content: string; authorId: number; isGenerated?: boolean }) {
    // Check if the author exists
    const authorExists = await this.prisma.user.findUnique({
        where: { id: data.authorId },
    });
    if(!authorExists) {
        throw new Error(`User with ID ${data.authorId} does not exist.`);
    }
    const savedBlog = await this.prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        author: {
          connect: { id: data.authorId }, // ✅ Connects the blog to an existing author
        },
      },
    });

    return savedBlog;
  }

  // async createBlog(authorId: number, data: CreateBlogDto) {
  //   const authorExists = await this.prisma.user.findUnique({
  //     where: { id: data.authorId },
  //   });
  //   if(!authorExists) {
  //       throw new Error(`User with ID ${data.authorId} does not exist.`);
  //   }

  //   return this.prisma.blog.create({
  //     data: {
  //       ...data,
  //       authorId,
  //     },
  //   });
  // }

  // Get all blog posts
  // async getAllBlogs() {
  //   return this.prisma.blog.findMany({ include: { author: true } });
  // }
  async getAllBlogs() {
    return this.prisma.blog.findMany({
      include: { author: { select: { email: true } } },
    });
  }

  // Get a single blog post by ID
  async getBlogById(id: number) {
    // return this.prisma.blog.findUnique({ where: { id }, include: { author: true } });
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  // Update a blog post
  async updateBlog(id: number, data: Prisma.BlogUpdateInput) {
    return this.prisma.blog.update({ where: { id }, data });
  }

  // Delete a blog post
  async deleteBlog(id: number) {
    return this.prisma.blog.delete({ where: { id } });
  }
}
