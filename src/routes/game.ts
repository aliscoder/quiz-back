import express from "express";
import { answer, getGame, getGamePlayers } from "../controllers/game";

const gameRouter = express.Router();

gameRouter.get("/get_game/:id", getGame);
gameRouter.get("/get_players/:gameId", getGamePlayers);
gameRouter.post("/answer", answer);

export default gameRouter;
