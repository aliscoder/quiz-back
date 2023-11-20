import express, { Express } from "express";
import toursRouter from "../routes/tour";
import cors from "cors";
import errorHandler from "../middlewares/error";
import gameRouter from "../routes/game";

export default (app: Express) => {
  app.use(cors());
  app.use(express.static("public"));

  app.use("/tour", toursRouter);
  app.use("/game", gameRouter);

  app.use(errorHandler);
};
