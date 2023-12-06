import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword, createPassword } from "../utils/password";
import Avatar from "../models/Avatar";

// SEND GENERETAED VERIFICATION CODE
export const sendVerificationCode = async (req: Request, res: Response) => {
  const { phone } = req.body;
  // axios.post(
  //   "https://raygansms.com/AutoSendCode.ashx",
  //   {
  //     UserName: "shaludama",
  //     Password: "Ali8825512217",
  //     Mobile: phone,
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   }
  // );
  const user = await User.findOne({ phone });
  res.status(200).json({ status: user ? "login" : "register" });
};

export const register = async (req: Request, res: Response) => {
  const { phone, username, password, code } = req.body;

  // const SMSresponse = await axios.post(
  //   "https://raygansms.com/CheckSendCode.ashx",
  //   {
  //     UserName: "shaludama",
  //     Password: "Ali8825512217",
  //     Mobile: phone,
  //     Code: code,
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   }
  // );

  // if (!SMSresponse.data) {
  //   res.status(400).json({ error: "کد وارد شده نامعتبر است" });
  // } else {

  const user = new User();
  user.phone = phone;
  user.username = username;
  user.password = await createPassword(password);
  user.avatar = (await Avatar.find())[0]._id;
  const newUser = await user.save();

  delete user.password;

  const token = jwt.sign({ userId: newUser._id }, process.env.PRIVATE_KEY);
  res.status(200).json({ token, user: newUser });
  // }
};

// LOGIN CLIENT
export const Login = async (req: Request, res: Response) => {
  const { phone, password, code } = req.body;

  const userExist = Boolean(await User.exists({ phone }));

  // const SMSresponse = await axios.post(
  //   "https://raygansms.com/CheckSendCode.ashx",
  //   {
  //     UserName: "shaludama",
  //     Password: "Ali8825512217",
  //     Mobile: phone,
  //     Code: enteredCode,
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   }
  // );

  // if (!SMSresponse.data) {
  //   res.status(400).json({ error: "کد وارد شده نامعتبر است" });
  // } else {
  if (!password || !userExist) {
    res.status(400).json({ error: "اطلاعات نامعتبر است" });
  } else {
    const user = await User.findOne({ phone });
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "اطلاعات نامعتبر است" });
    } else {
      delete user.password;
      const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY);
      res.status(200).json({ token, user });
    }
  }

  // }
};
