import express from "express";
import { employeeLogin, login, signup } from "../controller/auth.controller.js";

const router = express.Router();
const authRouter=router

authRouter.post("/sign-up",signup);
authRouter.post("/login",login);
authRouter.post("/employee/login",employeeLogin);

export default authRouter;