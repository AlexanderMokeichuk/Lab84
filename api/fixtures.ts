import mongoose from "mongoose";
import config from "./src/config";
import User from "./src/models/User";
import Task from "./src/models/Task";

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, sipping drop..`);
  }
};

const collections = ['users', 'tasks'];

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) {
    await dropCollection(db, collection);
  }

  const [userOne, userTwo] = await User.create({
    username: "User1",
    password: "12345",
  }, {
    username: "User2",
    password: "54321",
  });

  await Task.create({
    user: userOne,
    title: "TestUserOne",
    status: "NEW",
  },{
    user: userTwo,
    title: "TestUserTwo",
    description: "Test fixtures!!",
    status: "NEW",
  });

  await db.close();
};

void run();