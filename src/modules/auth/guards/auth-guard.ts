import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  //todo best typing
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token not present");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SIGNATURE_PASSWORD
      });
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("Token inválido o expirado");
    }
    return true;
  }
  private extractTokenFromHeader(req: any): string | undefined {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
