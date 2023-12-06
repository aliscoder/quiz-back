import express from "express";
import { Login, register, sendVerificationCode } from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/send_code", sendVerificationCode);
authRouter.post("/login", Login);
authRouter.post("/register", register);

export default authRouter;
