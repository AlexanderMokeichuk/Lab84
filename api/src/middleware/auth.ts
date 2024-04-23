import {NextFunction, Request, Response} from "express";
import {HydratedDocument} from "mongoose";
import {UserApi} from "../type";
import User from "../models/User";

export interface RequestWithUser extends Request {
  user?: HydratedDocument<UserApi>
}
const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const tokenData = req.get('Authorization');
  if (!tokenData) {
    return res.status(401).send({error: "No token provided"});
  }

  const [_, token] = tokenData.split(" ");

  const user = await User.findOne({token});

  if (!user) {
    return res.status(403).send({error: "Wrong token"});
  }
  req.user = user;
  next();
};

export default auth;