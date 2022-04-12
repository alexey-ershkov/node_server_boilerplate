export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  balance: number;
}

export type UserInfo = Omit<User, 'password'>;
export type CreateUserInfo = Omit<User, 'id' | 'balance'>;
export type AuthUserInfo = Pick<User, 'password' | 'email'>;
