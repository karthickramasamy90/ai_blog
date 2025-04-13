import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  // async createUser(data: Prisma.UserCreateInput) {
  //   return this.prisma.user.create({ data });
  // }


  async createUser(userData: { email: string; password: string }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds); // Hash password

    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword, // Store hashed password
      },
    });
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return false;
  
    return bcrypt.compare(password, user.password); // Compare raw & hashed password
  }

  // Get all users
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Get a user by ID
  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Get a user by Email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: {email} });
  }
}
