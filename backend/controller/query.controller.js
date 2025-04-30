import { getConnection } from "../db/db.js"
import { ObjectId } from "mongodb"; 


export const saveQuery =async(req,res) => {
    try {
        const collection=await getConnection("contact");
        const data=await collection.insertOne(req.body);  
        res.send(data);
       } catch (error) {
        console.log(error,"error in contact function");
        res.end()
       }
}


export const getQuery = async (req, res) => {
          try {
            const collection = await getConnection("contact");
            const data = await collection.find({}).toArray();
            res.send(data);
          } catch (error) {
            console.log(error, "error in GET /contact function");
            res.status(500).send("Error fetching contacts");
          }
}



export const deleteQuery = async (req, res) => {
  try {
    const collection = await getConnection("contact");
    const id = req.params.id;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send("No query found with that ID");
    }

    res.status(200).send({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /contact/:id function:", error);
    res.status(500).send("Error deleting contact");
  }
};
