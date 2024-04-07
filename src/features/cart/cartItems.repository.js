import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productId, userId, quantity) {
    // console.log(typeof quantity);
    try {
      //get the database.
      const db = getDb();
      //get collection.
      const collection = db.collection(this.collection);

      //get the id
      const id = await this.getNextCounter(db);

      //update(increament) if exist or create if not exist.
      await collection.updateOne(
        {
          productId: new ObjectId(productId),
          userId: new ObjectId(userId),
        },
        {
          $setOnInsert: { _id: id },
          $inc: {
            quantity: quantity, // or the amount by which you want to increment
          },
        },
        {
          upsert: true,
        }
      );

      //it will just create new cart item.
      // await collection.insertOne({
      //   productId: new ObjectId(productId),
      //   userId: new ObjectId(userId),
      //   quantity,
      // });
    } catch (err) {
      console.log("error: ",err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );

    // console.log('resultDocument: ',resultDocument);
    return resultDocument.value.value;
  }

  async getAllCartItems(userId) {
    try {
      //get the database.
      const db = getDb();
      //get collection.
      const collection = db.collection(this.collection);
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async deleteCartItem(userId, cartItemId) {
    try {
      //get the database.
      const db = getDb();
      //get collection.
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        userId: new ObjectId(userId),
        _id: new ObjectId(cartItemId),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
