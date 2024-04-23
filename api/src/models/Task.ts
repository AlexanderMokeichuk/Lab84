import mongoose, {Schema} from "mongoose";
import {Task} from "../type";

const TaskSchema = new Schema<Task>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String || null,
  status: {
    type: String,
    enum: ['NEW', 'STATUS'],
    default: 'NEW',
  },
},{
  versionKey: false,
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;