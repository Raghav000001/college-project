import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb://0.0.0.0:27017";
const client = new MongoClient(MONGO_URI);
let isConnected = false;

const getConnection = async (collectionName) => {
  if (!isConnected) {
    await client.connect();
    console.log("Database connected");
    isConnected = true;
  }

  const db = client.db("admin-panel");
  return db.collection(collectionName);
};

export { getConnection };
