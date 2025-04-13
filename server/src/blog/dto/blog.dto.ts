// src/blog/dto/blog.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateBlogDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  content?: string;
}

export class SaveBlogDto {
  title: string;
  content: string;
  isGenerated?: boolean; // Add this if missing
}