import { Request, Response } from "express";
import { faker } from "@faker-js/faker/locale/fa";
import _ from "lodash";
import moment from "jalali-moment";

export const getGame = async (req: Request, res: Response) => {
  const { id } = req.params;

  const startTime = 1700495490;
  const endTime = 1700495490 + 60000;

  res.status(400).json({
    id,
    type: 50000,
    startTime,
    endTime,
    status:
      moment().unix() < startTime
        ? "before"
        : moment().unix() > endTime
        ? "after"
        : "start",
  });
};

export const getGamePlayers = async (req: Request, res: Response) => {
  const { gameId } = req.params;

  res.status(400).json([
    {
      id: "1",
      name: "علی",
      avatar: faker.image.imageUrl(),
      point: 5,
      rank: "down",
    },
    {
      id: "2",
      name: "رضا",
      avatar: faker.image.imageUrl(),
      point: 0,
      rank: "idle",
    },
    {
      id: "3",
      name: "حامد",
      avatar: faker.image.imageUrl(),
      point: 10,
      rank: "up",
    },
    {
      id: "4",
      name: "حمید",
      avatar: faker.image.imageUrl(),
      point: 25,
      rank: "down",
    },
    {
      id: "5",
      name: "سعید",
      avatar: faker.image.imageUrl(),
      point: 15,
      rank: "idle",
    },
    {
      id: "6",
      name: "تقی",
      avatar: faker.image.imageUrl(),
      point: 0,
      rank: "idle",
    },
  ]);
};

export const answer = async (req: Request, res: Response) => {
  const { gameId, playerId, qId, answer } = req.body;

  // game -> get
  // check startTime , endTime
  // res.status(400).json({error : 'زمان تمام شده'})

  // answer = number
  const firstQ = {
    id: "1",
    body: "طراحان سایت هنگام طراحی قالب سایت معمولا با این موضوع رو برو هستند که محتوای اصلی صفحات آماده نیست. در نتیجه طرح کلی دید درستی به کار فرما نمیدهد",
    option1: "تمرکز کنند",
    option2: "سلام",
    option3: "غلام",
    option4: "علی",
  };
  const nextQ = { answer: "" };

  if (qId === null && answer === null) {
    res.status(200).json(firstQ);
  } else {
    const q = { answer: "" };
    if (answer === q.answer) {
      // point ++
    }

    res.status(200).json(nextQ);
  }
};
