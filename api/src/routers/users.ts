import express from "express";
import mongoose, {mongo} from "mongoose";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();

    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    if (e instanceof mongo.MongoServerError && e.code === 11000) {
      return res.status(422).send({error: "This login is already in use!!"});
    }

    next(e);
  }
});

usersRouter.post("/sessions", async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({error: "Incorrect data!!"});
  }
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      return res.status(400).send({error: "Username or password are not correct!!"});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(400).send({error: "Username or password are not correct!!"});
    }

    user.generateToken();
    user.save();
    return res.send({message: "Username and password correct!", user});
  } catch (e) {
    next();
  }
});

export default usersRouter;