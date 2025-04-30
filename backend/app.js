import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.route.js";
import queryRouter from "./routes/query.route.js";
import employeeRouter from "./routes/employee.route.js";
import attendanceRouter from "./routes/attendance.route.js";
import salaryRoute from "./routes/salary.route.js";
import leaveRoutes from "./routes/leave.route.js"

const app = express();
const port = 3000;
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/", authRouter);
app.use("/", queryRouter);
app.use("/", employeeRouter);
app.use("/", attendanceRouter);
app.use("/", salaryRoute);
app.use('/', leaveRoutes);


 

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});