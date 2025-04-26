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
