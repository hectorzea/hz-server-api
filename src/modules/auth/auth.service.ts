import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { UserRegister } from "./interfaces/auth.interface";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async register(registerPayload: UserRegister) {
    const { email, password } = registerPayload;

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException("This email is in use");
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = new this.userModel({ email, password: hashedPassword });

    await newUser.save();

    return {
      message: "User registered",
      user: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.roles
      }
    };
  }
  async login(loginPayload: UserRegister) {
    const { email, password } = loginPayload;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return {
      id: String(user._id),
      email: user.email,
      roles: user.roles
    };
  }
}
