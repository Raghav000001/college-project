import express from 'express';
import { manageSalary } from '../controller/salary.controller.js';
const router = express.Router();
const salaryRoute = router;



salaryRoute.post('/employee/:id/adjustment',manageSalary);


  export default salaryRoute;
  
  