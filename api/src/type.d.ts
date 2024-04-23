import {Model} from "mongoose";

export interface User {
  username: string,
  password: string,
  token: string,
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>,
  generateToken(): void,
}

export type UserModel = Model<User, [], UserMethods>;

export interface Task {
  user: Types.ObjectId,
  title: string,
  description: string | null,
  status: string,
}