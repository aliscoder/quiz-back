import express from "express";
import { getTours } from "../controllers/tour";

const tourRouter = express.Router();

tourRouter.get("get_tours", getTours);

//

export default tourRouter;
