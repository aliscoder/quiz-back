import express, { Express } from "express";
import cors from "cors";
import errorHandler from "../middlewares/error";
import gameRouter from "../routes/game";
import authRouter from "../routes/auth";
import depositRouter from "../routes/deposit";

export default (app: Express) => {
  app.use(cors());
  app.use(express.static("public"));

  app.use("/games", gameRouter);
  app.use("/auth", authRouter);
  app.use("/deposit", depositRouter);

  app.use(errorHandler);
};
