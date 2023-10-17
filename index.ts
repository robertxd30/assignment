import express from "express";
import connectMongo from "./database/connectMongo";
import bodyParser from "body-parser";
import cors from "cors";
import apiRouter from "./routers/apiRouters";
const fs = require("fs");
const logger = require("morgan");

require("dotenv").config();

const app = express();

app.use(logger("dev"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  fs.appendFile("errors.log", `${new Date()} - ${err.stack} \n`, (err) => {
    if (err) console.log(err);
  });

  res.status(500).send("Something failed.");
});

connectMongo();

const port = process.env.SERVER_PORT || 8080;

app.use("/api", apiRouter);

app.listen(port, () => console.log(`Running on port ${port}`));
