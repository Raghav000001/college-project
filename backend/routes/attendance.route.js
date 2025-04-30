import express from "express";
import { markAttendance, getEmployeeAttendance, getAllAttendance } from "../controller/attendance.controller.js";

const router = express.Router();
const attendanceRouter = router;

attendanceRouter.post("/mark-attendance", markAttendance);
attendanceRouter.get("/employee-attendance/:id", getEmployeeAttendance);
attendanceRouter.get("/all-attendance", getAllAttendance);
export default attendanceRouter;