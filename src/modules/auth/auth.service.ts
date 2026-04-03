import { Injectable } from "@nestjs/common";
import { UserRegister } from "./interfaces/auth.interface";
@Injectable()
export class AuthService {
  async register(registerPayload: UserRegister) {
    return "";
  }
}
