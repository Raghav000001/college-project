import { getConnection } from "../db/db.js";
import bycrypt from "bcrypt";
import { ObjectId } from "mongodb";


export const createEmployee = async (req, res) => {

    try {
        const collection=await getConnection("employee");
            const salt=bycrypt.genSaltSync(10);
            const hashedPassword=bycrypt.hashSync(req.body.password,salt);
            req.body.password=hashedPassword;
            const data=await collection.insertOne(req.body);
            res.send(data);
      } catch (error) {
        console.log(error,"error in add employee function");
        res.end()
      }
}

export const getEmployee = async (req, res) => {
    try {
        const collection=await getConnection("employee");
        const data=await collection.find({}).toArray();
        res.send(data);
      } catch (error) {
        console.log(error,"error in employee function");
        res.end()
    }

}


export const getEmployeeById = async (req, res) => {
        try {
            const collection=await getConnection("employee");
            const id=req.params.id;
            const data=await collection.findOne({_id:new ObjectId(id)});
            if (!data) {
                return res.status(404).send("Data not found");
            }
            res.send(data);
        } catch (error) {
            console.log(error.message,"error in get data by id route");
            res.status(500).send("Error fetching data");
        }

}

export const deleteEmployee = async (req, res) => {
     try {
       const collection = await getConnection("employee");
       const { id } = req.params;
       const data = await collection.deleteOne({ _id: new ObjectId(id) });
       res.send(data);
     } catch (error) {
       console.log(error.message, "error in delete route");
       res.status(500).send("Error deleting data");
     }
 
}

export const ratings = async (req, res) => {
    try {
        // Check if it's a GET request (retrieving ratings)
        if (req.method === 'GET') {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Employee ID is required"
                });
            }
            
            const ratingsCollection = await getConnection("ratings");
            
            const ratings = await ratingsCollection.find({
                employeeId: new ObjectId(id)
            }).sort({ createdAt: -1 }).toArray();
            
            return res.status(200).json({
                success: true,
                data: ratings
            });
        }
        
        // Handle POST request (adding a rating)
        // Make sure req.body is not undefined
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }
        
        const { employeeId, rating, feedback, period, date } = req.body;
        
        // Log the request body to debug
        console.log("Request body:", req.body);
        
        if (!employeeId || !rating || !period) {
            return res.status(400).json({ 
                success: false, 
                message: "Employee ID, rating, and period are required" 
            });
        }
        
        // Validate rating is between 1-5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: "Rating must be between 1 and 5" 
            });
        }
        
        const ratingsCollection = await getConnection("ratings");
        const employeeCollection = await getConnection("employee");
        
        // Verify employee exists
        const employeeExists = await employeeCollection.findOne({ 
            _id: new ObjectId(employeeId) 
        });
        
        if (!employeeExists) {
            return res.status(404).json({ 
                success: false, 
                message: "Employee not found" 
            });
        }
        
        // Create rating document
        const ratingData = {
            employeeId: new ObjectId(employeeId),
            rating: Number(rating),
            feedback: feedback || "",
            period,
            date: date || new Date().toISOString(),
            createdAt: new Date()
        };
        
        const result = await ratingsCollection.insertOne(ratingData);
        
        res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            data: result
        });
    } catch (error) {
        console.log(error, "Error in employee rating function");
        res.status(500).json({
            success: false,
            message: "Failed to process rating request",
            error: error.message
        });
    }
}
