import express from "express";
import {addLeaveRequest, getLeaveRequest, getLeaveRequests, updateLeaveRequest } from "../controller/leave.controller.js";

const router = express.Router();
const leaveRoutes=router

leaveRoutes.post("/leave-requests",addLeaveRequest);
leaveRoutes.get("/leave-requests/employee/:employeeId",getLeaveRequest);
leaveRoutes.get("/leave-requests/all",getLeaveRequests);
leaveRoutes.put("/leave-requests/update/:id",updateLeaveRequest);

export default leaveRoutes;