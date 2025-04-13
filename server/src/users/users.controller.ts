import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Create a user
  // @Post()
  // async createUser(@Body() userData: { name: string; email: string; password: string }) {
  //   return this.usersService.createUser(userData);
  // }

  @Post()
  async createUser(@Body() userData: { email: string; password: string }) {
    return this.usersService.createUser(userData); // ✅ Now properly passes all data
  }

  // Get all users
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // Get user by ID
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }
}
