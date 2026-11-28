import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../interfaces/auth.interface";
import { Request } from "express";
import { InvalidTokenError, TokenMissingError } from "../errors/auth.error";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new TokenMissingError();
    }

    try {
      const payload = await this.jwtService.verifyAsync<User>(token, {
        secret: process.env.JWT_SIGNATURE_PASSWORD
      });
      request["user"] = payload;
    } catch (error) {
      throw new InvalidTokenError("Invalid or expired token", { cause: error });
    }
    return true;
  }
  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
