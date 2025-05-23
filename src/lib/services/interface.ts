export interface AuthUser {
  token: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
  roles: string[];
  [key: string]: any;
}