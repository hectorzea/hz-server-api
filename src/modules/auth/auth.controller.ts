import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "./guards/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenPayload, User, UserRegister } from "./interfaces/auth.interface";
import { AuthService } from "./auth.service";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./roles.decorator";

@Controller("api/auth")
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  @Post("register")
  async register(@Body() registerPayload: UserRegister) {
    return this.authService.register(registerPayload);
  }

  @Post("login")
  async login(@Body() loginPayload: UserRegister, @Res() res: Response) {
    const payload = await this.authService.login(loginPayload);
    const accessToken = await this.jwtService.signAsync<TokenPayload>(payload);
    const refreshToken = await this.jwtService.signAsync<TokenPayload>(
      payload,
      {
        expiresIn: "7d"
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @Get("profile")
  profile() {
    return { name: "Hector Zea" };
  }

  @Get("refresh")
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException(
        "Token is not present, do a login to generate it"
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync<User>(refreshToken, {
        secret: process.env.JWT_SIGNATURE_PASSWORD
      });

      const newAccessToken = await this.jwtService.signAsync<User>({
        email: payload.email
      });

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException("Refresh token expirado o inválido");
    }
  }
  @Post("logout")
  logout(@Res() res: Response) {
    // res.clearCookie le dice al navegador: "Mata esta galleta ya mismo"
    // Las opciones DEBEN coincidir con las que usaste al crearla
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // false en local, true en prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({ message: "Session closed" });
  }
}
