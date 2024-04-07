import { ObjectId } from "mongodb";
import { getClient, getDb } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    // const client = getClient();
    // const session = client.startSession();
    try {
      const db = getDb();
      // session.startTransaction();
      //1.Get cart item of users and calculate the totalAmount.
      const items = await this.getTotalAmount(userId);
      const finalTotalAmount = items.reduce((acc, item) => {
        return acc + item.totalAmount;
      }, 0);
      console.log(finalTotalAmount);

      //2.Create a record for order.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder);
      //3.Reduce the stock(product's quantity).
      for (let item of items) {
        await db.collection("products").updateOne(
          { _id: item.productId },
          {
            $inc: { stock: -item.quantity },
          },
         
        );
      }
      //  throw new Error("Something is wrong!")
      //4.Clear the cart.
      await db.collection("cartItems").deleteMany(
        {
          userId: new ObjectId(userId),
        },
    
      );
      // session.commitTransaction();
      // session.endSession();
      return;
    } catch (err) {
      // await session.abortTransaction();
      // session.endSession();
      console.log('object');
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId) {
    const db = getDb();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          //1.get cart items for the user
          {
            $match: { userId: new ObjectId(userId) },
          },
          //2. get the products from product's collection.
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          //3. unwind the productInfo.
          {
            $unwind: "$productInfo",
          },
          //4.calculate the totalAmount for each cart items.
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
       
      )
      .toArray();
    return items;
  }
}
