import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import mongoose from "mongoose";
import Task from "../models/Task";
import {TaskApi} from "../type";

const tasksRouter = express.Router();

tasksRouter.post("/", auth, async (req, res, next) => {
  try {
    const taskPost = new Task<Task>({
      user: req.body.user,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

    await taskPost.save();
    return res.send(taskPost);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    next();
  }
});

tasksRouter.get("/", auth, async (req, res, next) => {
  const user = (req as RequestWithUser).user!;

  try {
    const tasks: TaskApi[] = await Task.find({user: user._id.toString()});
    return res.send(tasks);
  } catch (e) {
    next();
  }
});

tasksRouter.put("/:id", auth, async (req: RequestWithUser, res, next) => {
  const id = req.params.id;
  const user = (req as RequestWithUser).user!;

  if (!req.body.title || !req.body.status) {
    return res.status(400).send({error: "Incorrect data!!"});
  }

  try {
    const editTask = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };
    const resultEdit = await Task.findOneAndUpdate(
      {
        _id: id,
        user: user._id,
      },
      editTask,
      {runValidators: true},
    );

    if (!resultEdit) {
      return res.status(403).send({error: "Access is denied"});
    }

    return res.send({
      _id: id,
      user: user._id,
      ...editTask,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({error: error.message});
    }
    return next(error);
  }
});

tasksRouter.delete("/:id", auth, async (req: RequestWithUser, res, next) => {
  const id = req.params.id;
  const user = (req as RequestWithUser).user!;

  try {
    const deleteTask = await Task.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deleteTask) {
      return res.status(403).send({error: "Access is denied"});
    }

    return res.send("Ok");
  } catch (error) {
    return next(error);
  }
});

export default tasksRouter;