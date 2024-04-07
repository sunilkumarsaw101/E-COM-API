import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserRepository {
  constructor(){
    this.collection= "users";
  }
  async signUp(newUser) {
    try {
      //1. get the database.
      const db = getDb();
      //2. get the collection.
      const collection = db.collection(this.collection);
      //3.Insert the document
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async signIn(email, password) {
  //   try {
  //     //1. get the database.
  //     const db = getDb();
  //     //2. get the collection.
  //     const collection = db.collection(this.collection);
  //     //3.Find the document
  //     return await collection.findOne({ email, password });
  //   } catch (err) {
  //     console.log("this is error: ", err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  async findByEmail(email) {
    try {
      //1. get the database.
      const db = getDb();
      //2. get the collection.
      const collection = db.collection("users");
      //3.Find the document
      return await collection.findOne({ email });
    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
