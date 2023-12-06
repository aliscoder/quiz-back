import { Request, Response } from "express";
import ZarinPalCheckout from "zarinpal-checkout";
import Deposit from "../models/Deposit";

const zarinpal = ZarinPalCheckout.create(
  "0e9d5222-ac22-11e7-a1bb-000c295eb8fc",
  false
);

export const depositCoin = async (req: Request, res: Response) => {
  const { amount, userId } = req.body;
  zarinpal
    .PaymentRequest({
      Amount: Number(amount), // In Tomans
      CallbackURL: "localhost:3000/games/verify",
      Description: "pay coin",
    })
    .then(async (response) => {
      if (response.status === 100) {
        Deposit.create({
          amount: Number(amount),
          userId,
          secret: response.authority,
        }).then(() => {
          res.status(200).json({ url: response.url });
          res.status(200).json({ url: response.url });
        });
      }
    })
    .catch((err) => {
      res.status(400).json("خطا در برقراری ارتباط");
    });
};

export const verifyDeposit = async (req: Request, res: Response) => {
  const { Authority } = req.query;

  const deposit = await Deposit.findOne({ secret: Authority });

  zarinpal
    .PaymentVerification({
      Amount: deposit.amount,
      Authority: Authority.toString(),
    })
    .then(async (response) => {
      if (response.status == 101) {
        await Deposit.findOneAndUpdate(
          { secret: Authority },
          {
            $set: { status: "done" },
          }
        );
        res.status(200).json("done");
      } else {
        await Deposit.findOneAndUpdate(
          { secret: Authority },
          {
            $set: { status: "rejected" },
          }
        );
        res.status(403).json({ error: "خطا در پرداخت" });
      }
    })
    .catch(async (err) => {
      await Deposit.findOneAndUpdate(
        { secret: Authority },
        {
          $set: { status: "rejected" },
        }
      );
      res.status(403).json({ error: "خطا در پرداخت" });
    });
};
