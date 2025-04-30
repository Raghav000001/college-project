import express from "express";
import { getQuery, saveQuery,deleteQuery } from "../controller/query.controller.js";

const router = express.Router();
const queryRouter=router
  
queryRouter.post("/contact",saveQuery);
queryRouter.get("/contact",getQuery);
queryRouter.delete("/contact/:id",deleteQuery);

export default queryRouter;