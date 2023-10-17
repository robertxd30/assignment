import { Router } from "express";
import UserModel from "../models/User";
const Redis = require("redis");
const Queue = require("bull");

const redisClient = Redis.createClient();
const queue = new Queue("jobQueue", { redis: redisClient });
redisClient.connect()
const apiRouter = Router();

apiRouter.get("/ping", (_, res) => {
  res.json({ message: "pong" });
});

apiRouter.get("/users", async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;

  const sort = {};
  if (req.body.sortBy) {
    const parts = req.body.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const users = await UserModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

apiRouter.get("/user/:id", async (req, res) => {
  try {
    let results;
    let isCached = false;
    const cacheResults = await redisClient.get(req.params.id);

    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await UserModel.findById(req.params.id);
      await redisClient.set(req.params.id, JSON.stringify(results));
    }

    if (!results) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      fromCache: isCached,
      data: results,
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error fetching user" });
  }
});

apiRouter.post("/users", async (req, res) => {
  const newUser = new UserModel({
    name: req.name,
    email: req.email,
  });
  await redisClient.set(newUser._id, JSON.stringify(newUser));
  return await newUser.save();
});

apiRouter.put("/users/:id", async (req, res) => {
  const { id } = req.params;

  const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  await redisClient.set(id, JSON.stringify(req.body));
  res.json(updatedUser);
});

apiRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const deletedUser = await UserModel.findByIdAndDelete(id);
  await redisClient.del(id, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
  res.json(deletedUser);
});

apiRouter.post("/jobs", (req, res) => {
  const job = queue.add(req.body);
  queue.process((job) => {
    job.done();
  });
  res.json(job);
});

apiRouter.get("/jobs", (req, res) => {
  const jobs = queue.getJobs();
  res.json(jobs);
});

apiRouter.get("/jobs/:id", (req, res) => {
  const job = queue.getJob(req.params.id);

  if (job) {
    res.json(job.getState());
  } else {
    res.sendStatus(404);
  }
});
export default apiRouter;
