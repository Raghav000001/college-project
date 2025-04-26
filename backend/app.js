import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import queryRouter from "./routes/query.route.js";
import employeeRouter from "./routes/employee.route.js";

const app = express();
const port = 3000;
dotenv.config();
app.use(express.json());
app.use(cors());

//routes
app.use("/", authRouter);
app.use("/", queryRouter);
app.use("/", employeeRouter); 

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});