//import the database.
import { MongoClient } from "mongodb";
// const url= process.env.DB_URL;
let client;
//function to connect to database.
export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("MongoDB is connected successfully");
      //create counter.
      createCounter(client.db());
      //create indexes.
      createIndexes(client.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient= ()=>{
  return client;
}

//function to access the database.
export const getDb = () => {
  return client.db();
};

//to make the custom id as simple as (1, 2, 3, ...);
const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};

//create indexes.
const createIndexes = async (db) => {
  try {
    db.collection("products").createIndex({price: 1});
    db.collection("products").createIndex({name: 1, category: -1});
    db.collection("products").createIndex({desc: 'text'});
  } catch (err) {
    console.log(err);
  }
  console.log("Indexes are created");
};
