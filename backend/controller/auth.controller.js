import { getConnection } from "../db/db.js"
import bycrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";

export const  signup = async (req, res) => {
     const {name,email,password}=req.body;
      try {
       const collection=await getConnection("admins");
       const existingUser =await collection.findOne({email: email});
   
       if (existingUser) {
         return res.status(400).send("admin already exists");
       }
       if(!name || !email || !password){
         return res.status(400).json({message:"Please fill all the fields"})
     }   
        const salt=bycrypt.genSaltSync(10);
        const hashedPassword=bycrypt.hashSync(req.body.password,salt);
        req.body.password=hashedPassword;
       const newUser=await collection.insertOne(req.body);  
       createToken(newUser._id,res);
       res.send(newUser);
      } catch (error) {
       console.log(error,"error in sign-up function");
       res.end()
      }
   
}

export const login = async (req, res) => {
   try {
         const collection = await getConnection("admins");
         const { email, password } = req.body;
         const user=await collection.findOne({email});
         if (!user) {
           return res.status(401).json({ message: "User not found" });
       }
          const existingUser=await collection.findOne({email})
          if (existingUser) {
              const verify=bycrypt.compareSync(password,existingUser.password)
              if (verify) {
                createToken(existingUser._id,res);
                res.send(existingUser);
              } else {
               return res.status(401).json({ message: "Invalid credentials" });
              }
          }      
       } catch (error) {
           res.status(500).json({ message: "Something went wrong" });
       }

}

export const employeeLogin = async (req, res) => {
     const {email,password}=req.body;
     try {
      const collection= await getConnection("employee");
      const existingEmployee=await collection.findOne({email});
      if (existingEmployee) {
          const verify=bycrypt.compareSync(password,existingEmployee.password);
          if (verify) {
             createToken(existingEmployee._id,res);
             return res.send(existingEmployee);
          } else {
              return res.status(401).json({ message: "Invalid credentials" });
          }
      }
     } catch (error) {
      console.log(error,"error in sign-up function");  
     }
  
}