import express from "express";
import { createEmployee, deleteEmployee, getEmployee, getEmployeeById } from "../controller/employee.controller.js";

const router = express.Router();
const employeeRouter = router;

employeeRouter.post("/add-employee", createEmployee);
employeeRouter.get("/show-employees", getEmployee);
employeeRouter.get("/employee/:id", getEmployeeById);
employeeRouter.delete("/delete/:id", deleteEmployee);

export default employeeRouter;