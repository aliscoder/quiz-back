import { Request, Response } from "express";
import { Types } from "mongoose";
import { faker } from "@faker-js/faker/locale/fa";
import _, { random } from "lodash";
import moment from "jalali-moment";
import Game from "../models/Game";
import { IMAGES } from "../images";
import User from "../models/User";
import { createPassword } from "../utils/password";
import Question from "../models/Question";
import Avatar from "../models/Avatar";
import { generateAnswerString, isCorrect } from "../utils/generateAnswerString";

export const seedGames = async (req: Request, res: Response) => {
  await Game.remove();
  await User.remove();
  await Question.remove();
  await Avatar.remove();

  for (let i = 0; i < 20; i++) {
    const image = faker.image.avatar();
    await Avatar.create({
      url: image,
    });
  }

  const avatars = await Avatar.find();

  for (let i = 0; i < 200; i++) {
    await User.create({
      name: faker.name.fullName(),
      phone: faker.phone.number("0913#######"),
      point: _.random(0, 500),
      avatar: _.sample(avatars.map((item) => item._id)),
      username: "User " + (i + 1),
      password: await createPassword("123456789"),
    });
  }

  for (let i = 0; i < 200; i++) {
    await Question.create({
      body: faker.lorem.sentences(_.random(1, 3)),
      option1: faker.word.noun({ length: _.random(3, 8) }),
      option2: faker.word.noun({ length: _.random(3, 8) }),
      option3: faker.word.noun({ length: _.random(3, 8) }),
      option4: faker.word.noun({ length: _.random(3, 8) }),
      questionId: generateAnswerString(_.random(1, 4)),
    });
  }

  const users = await User.find();
  const questions = await Question.find();

  for (let i = 0; i < 15; i++) {
    const startTime = moment().unix() + random(500, 10000);
    const endTime = startTime + 60;

    const players = [];
    for (let j = _.random(1, 50); j < _.random(55, 200); j++) {
      players.push({ user: users[j]._id, point: 0, isUp: false });
    }

    const qs = [];
    for (let j = 0; j < 10; j++) {
      qs.push(questions[j + _.random(1, 150)]);
    }

    await Game.create({
      type: _.sample([50000, 100000, 200000, 500000]),
      startTime,
      endTime,
      image: _.sample(IMAGES),
      players,
      status: "before",
      questions: qs,
    });
  }

  res.status(200).json("done");
};

export const getAllGames = async (req: Request, res: Response) => {
  const games = await Game.find().populate("players.user");

  res
    .status(200)
    .json(games.filter((game) => game.startTime > moment().unix()));
};

export const getGame = async (req: Request, res: Response) => {
  const { id } = req.params;
  const game = await Game.findOne({ _id: id });
  res.status(200).json(game);
};

export const gamePlayerList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const game = await Game.findOne({ _id: id });
  res.status(200).json(game.players);
};

export const answerQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { playerId, qId, answer } = req.body;

  const game = await Game.findOne({ _id: id }).populate("questions");

  if (!answer) {
    res.status(200).json(game.questions[0]);
  } else {
    const currentQIndex = game.questions.findIndex((item) => item.id == qId);
    const nextQ = game.questions[currentQIndex + 1];
    const isItCorrect = await isCorrect(qId, answer);

    if (isItCorrect) {
      const currentPlayerPoint = game.players.find(
        (item) => item._id == playerId
      ).point;
      await Game.updateOne(
        { "players._id": playerId },
        {
          $set: {
            "players.$.point": currentPlayerPoint + 5,
            "players.$.isUp": true,
          },
        }
      );
    } else {
      await Game.updateOne(
        { "players._id": playerId },
        {
          $set: { "players.$.isUp": false },
        }
      );
    }

    res.status(200).json(nextQ);
  }
};

export const registerGame = async (req: Request, res: Response) => {
  const { userId, gameId, mode } = req.body;

  const game = await Game.findOne({ _id: gameId });
  if (game.startTime > moment().unix()) {
    if (
      game.players
        .map((item) => item.user._id)
        .includes(userId as Types.ObjectId)
    ) {
      await Game.updateOne(
        { _id: gameId },
        {
          $pull: { "players.user": userId },
        }
      );
    } else {
      await Game.updateOne(
        { _id: gameId },
        {
          $push: { players: { user: userId, point: 0, isUp: false } },
        }
      );
    }

    res.status(200).json("Done");
  } else {
    res.status(400).json({ error: "زمان ثبت نام گذشته است" });
  }
};
