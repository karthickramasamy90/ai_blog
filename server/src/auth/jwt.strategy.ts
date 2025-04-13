import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // console.log(":", req.cookies); // Debugging purpose
          return req?.cookies?.accessToken; // ✅ Extract JWT from cookies
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true }, // ✅ Include email in the response
    });

    if (!user) return null;

    if (!payload || !payload.userId) {
      throw new UnauthorizedException("Invalid token");
    }
    return { userId: user.id, email: user.email }; // ✅ Attach user to request
  }
}
