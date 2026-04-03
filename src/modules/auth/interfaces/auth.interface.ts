export interface User {
  email: string;
}

export type UserRegister = User & { password: string };
