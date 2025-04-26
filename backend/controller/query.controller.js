import { getConnection } from "../db/db.js"

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