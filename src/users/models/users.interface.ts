export class User {
  id: string;
  login: string;
  password?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface UserResponse {
  id: string;
  login: string;
  createdAt?: number;
  updatedAt?: number;
}
