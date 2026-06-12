export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
