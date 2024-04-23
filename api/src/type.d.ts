import {Model, Schema} from "mongoose";
import Types = module

export interface User {
  username: string,
  password: string,
  token: string,
}

export interface UserApi extends User {
  _id: Types.ObjectId,
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

export interface TaskApi extends Task {
  _id: Types.ObjectId,
}