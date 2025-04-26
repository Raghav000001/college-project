import express from "express";
import { getQuery, saveQuery } from "../controller/query.controller.js";

const router = express.Router();
const queryRouter=router
  
queryRouter.post("/contact",saveQuery);
queryRouter.get("/contact",getQuery);

export default queryRouter;