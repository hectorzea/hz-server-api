import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "./guards/auth-guard";
import { JwtService } from "@nestjs/jwt";

@Controller("api/auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}
  @Post("login")
  async login(@Body() loginPayload: any, @Res() res: Response) {
    //TODO database integration later
    //TODO ver como mejorar los errores inesperados internos ya que no logueo Error: secretOrPrivateKey must have a value de jwt
    // que pasa si en el login presiono varias veces login, genero multiples tokens? como funciona?
    const accessToken = await this.jwtService.signAsync(loginPayload);
    console.log(accessToken);
    const refreshToken = await this.jwtService.signAsync(loginPayload, {
      expiresIn: "7d"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      //TODO al mover a prd cambiar este valor a true, false para pruebas locales
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken });
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  profile() {
    return { name: "Hector Zea" };
  }
}
