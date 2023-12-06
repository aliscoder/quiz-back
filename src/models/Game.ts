import mongoose, { Document, Model, Schema, Types } from "mongoose";
import Player from "./User";
import User from "./User";

export type GameStatus = "before" | "start" | "after";

export type Player = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  point: number;
  isUp: boolean;
};

export interface GameInterface extends Document {
  type: number;
  startTime: number;
  endTime: number;
  image: string;
  players: Player[];
  status: GameStatus;
  questions: Types.ObjectId[];
}

const gameSchema: Schema = new mongoose.Schema<GameInterface>({
  type: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  players: {
    type: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        point: Number,
        isUp: Boolean,
      },
    ],
  },
  status: {
    type: String,
    required: true,
  },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

gameSchema.pre(["findOne", "find"], function (next) {
  this.populate({
    path: "players.user",
    model: User,
    select: ["_id", "avatar", "username"],
  });
  next();
});

//@ts-ignore
const Game: Model<GameInterface> = mongoose.model("Game", gameSchema);

export default Game;
