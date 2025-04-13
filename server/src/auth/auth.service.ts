import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // async login(user: any) {
  //   const payload = { email: user.email, sub: user.id };
  //   return {
  //     accessToken: this.jwtService.sign(payload),
  //   };
  // }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const tokens = await this.generateTokens(user.id, loginDto.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken); // Store refresh token in DB
  
    return tokens; // Ensure it returns { accessToken, refreshToken }
  }

  async generateTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' }
    );
  
    const refreshToken = this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    );
  
    return { accessToken, refreshToken }; // Ensure both are returned
  }

  // async generateTokens(userId: number, email: string) {
  //   const payload = { sub: userId, email };

  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: process.env.JWT_SECRET,
  //     expiresIn: '15m', // Short-lived access token
  //   });

  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: process.env.JWT_REFRESH_SECRET,
  //     expiresIn: '7d', // Long-lived refresh token
  //   });

  //   return { accessToken, refreshToken };
  // }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const hashedToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) return false;

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    return isValid ? user : null;
  }

}
