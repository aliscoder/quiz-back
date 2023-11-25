import express from "express";
import {
  getAllGames,
  seedGames,
  gamePlayerList,
  answerQuestion,
  getGame,
} from "../controllers/game";

const gameRouter = express.Router();

gameRouter.get("/", getAllGames);
gameRouter.get("/:id", getGame);
gameRouter.get("/:id/players", gamePlayerList);
gameRouter.post("/:id/answer", answerQuestion);

gameRouter.get("/seed", seedGames);

export default gameRouter;
