import { Controller, Post, Body, UnauthorizedException, Res, Req, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response, Request  } from 'express';
// import { AuthenticatedRequest } from '../types/express'; // Import your custom type
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedRequest } from "./authenticated-request"; // ✅ Import custom type


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  // @Post('login')
  // async login(@Body() loginDto: { email: string; password: string }) {
  //   const user = await this.authService.validateUser(loginDto.email, loginDto.password);
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   return this.authService.login(user);
  // }

  // @Post('login')
  // async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
  //   const user = await this.authService.validateUser(body.email, body.password);
  //   if (!user) {
  //     return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  //   }

  //   const tokens = await this.authService.generateTokens(user.id, user.email);
  //   await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

  //   return res.json(tokens);
  // }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
      const tokens = await this.authService.login(loginDto);

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true, // Set to true in production (HTTPS)
        sameSite: 'strict',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.json({ message: 'Login successful' });
    }

  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }, @Res() res: Response) {
    const user = await this.authService.validateRefreshToken(body.userId, body.refreshToken);

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
    }

    const tokens = await this.authService.generateTokens(user.id, user.email);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    return res.json(tokens);
  }

  // @Post('logout')
  // async logout(@Body() body: { userId: number }) {
  //   await this.authService.updateRefreshToken(body.userId, null); // Clear refresh token
  //   return { message: 'Logged out successfully' };
  // }

  // @Post('logout')
  // @UseGuards(AuthGuard('jwt'))
  // async logout(@Req() req: AuthenticatedRequest) {
  //   const userId = req.user?.userId; // Extract userId from authenticated request
  //   console.log("req.user", req.user)
  //   console.log("userId", userId)
  //   if (!userId) throw new UnauthorizedException("User not authenticated");

  //   // await this.authService.updateRefreshToken(userId, null);
  //   return { message: 'Logged out successfully' };
  // }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
    return { message: "Logged out successfully" };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt')) // ✅ Ensure the guard is applied
  async getProfile(@Req() req: AuthenticatedRequest) {

    if (!req.user) {
      throw new UnauthorizedException("User not authenticated");
    }

    return req.user; // ✅ Return user details from JWT
  }

}
