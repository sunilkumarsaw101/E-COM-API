import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor( name, email, password, type, id) {
  //  this._id=id,
    (this.name = name),
      (this.email = email),
      (this.password = password),
      (this.type = type);
       this._id = id;
  }

  // static async signUp(name, email, password, type) {
  //   try {
  //     //1. get the database.
  //     const db = getDb();
  //     //2. get the collection.
  //     const collection = db.collection("users");

  //     let newUser = new UserModel(
      
  //       name,
  //       email,
  //       password,
  //       type
  //         // users.length + 1,
  //     );
  //     // users.push(newUser);

  //     //3.Insert the document
  //    await collection.insertOne(newUser);
  //     return newUser;
  //   } catch (err) {
  //     throw new ApplicationError("Something went wrong", 500);
  //   }
  // }

  // static signIn(email, password) {
  //   // console.log(email, password);
  //   let user = users.find((u) => u.email == email && u.password == password);
  //   return user;
  // }
  static getAllUsers() {
    return users;
  }
}

var users = [
  new UserModel("Seller User", "seller@ecom.com", "Password", "seller",1),
  new UserModel("Customer", "customer@ecom.com", "Password", "customer",2),
];
