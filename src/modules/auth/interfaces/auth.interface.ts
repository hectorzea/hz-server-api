export interface User {
  email: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  roles: string[];
}

export type UserRegister = User & { password: string };

// Extend Express Request
export interface RequestWithUser extends Request {
  user: TokenPayload;
}
