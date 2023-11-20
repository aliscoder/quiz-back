import { Request, Response } from "express";
import { faker } from "@faker-js/faker/locale/fa";
import _ from "lodash";
import moment from "jalali-moment";
export const getTours = async (req: Request, res: Response) => {
  const tours = [];
  for (let i = 0; i < 100; i++) {
    const start = moment().unix();
    const end = start + 60000;
    tours.push({
      id: i + 1,
      type: _.sample([50000, 100000, 200000]),
      startTime: start,
      endTime: end,
      image: faker.image.imageUrl(),
      avatars: [
        faker.image.imageUrl(),
        faker.image.imageUrl(),
        faker.image.imageUrl(),
        faker.image.imageUrl(),
        faker.image.imageUrl(),
        faker.image.imageUrl(),
        faker.image.imageUrl(),
      ],
    });
  }

  res.status(200).json(tours);
};
