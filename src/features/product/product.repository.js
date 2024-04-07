import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { CategorySchema } from "./category.schema.js";


//here inside model first parameter is collection's name i.e product and 2nd parameter is schema.
const ProductModel= mongoose.model('Product', productSchema);
const ReviewModel= mongoose.model('review', reviewSchema);
const CategoryModel= mongoose.model('Category', CategorySchema)
class productRepository {
  constructor() {
    this.collection = "products";
  }
  async add(productData) {
    try {
      // //1. get the database.
      // const db = getDb();
      // //2. get the collection.
      // const collection = db.collection(this.collection);
      // //3.Insert the document
      // await collection.insertOne(newProduct);
      // return newProduct;

      console.log('hello:',productData.categories);

      //1.Add the product.
      productData.categories= productData.categories.split(',').map(e=>e.trim());
      console.log('final',productData);

      const newProduct= new ProductModel(productData);
      const savedProduct= await newProduct.save();
      console.log('saved prod: ', savedProduct);
      
      //2. update categories.

      await CategoryModel.updateMany(
        {_id: {$in: productData.categories}},
        {$push: {products: new ObjectId(savedProduct._id)}}
      );
    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async getAll() {
    try {
      //1. get the database.
      const db = getDb();
      //2. get the collection.
      const collection = db.collection(this.collection);
      //3. get all the documents inside the collection.
      const result = await collection.find().toArray();
      return result;
    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async getAnyOneProduct(id) {
    try {
      //1. get the database.
      const db = getDb();
      //2. get the collection.
      const collection = db.collection(this.collection);
      //3. get all the documents inside the collection.
      const result = await collection.findOne({ _id: new ObjectId(id) });
      return result;
    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      //1. get the database.
      const db = getDb();
      //2. get the collection.
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      //project method is used to change the response data i.e it can include or exclude items from response.
      //1 means inclusion and 0 means exclusion.
      let res = await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0 })
        .toArray();
      console.log(res);
      return res;
    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async rate(userId, productId, rating) {
  //   try {
  //     //1. get the database.
  //     const db = getDb();
  //     //2. get the collection.
  //     const collection = db.collection(this.collection);
  //     //3. find the product.
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productId),
  //     });
  //     //4. find the userRating.
  //     const userRating = product?.ratings?.find((r) => r.userId == userId);

  //     if (userRating) {
  //       console.log('object');
  //       //5. update the rating.
  //       await collection.updateOne(
  //         {
  //           //filtering
  //           _id: new ObjectId(productId),
  //           "ratings.userId": new ObjectId(userId)
  //         },
  //         {
  //           //updating
  //           $set: { "ratings.$.rating": rating }
  //         }
  //       );
  //     } else {
  //       console.log('heee');
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //         },
  //         {
  //           $push: { ratings: { userId: new ObjectId(userId), rating } },
  //         }
  //       );
  //     }
  //   } catch (err) {
  //     console.log("this is error: ", err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  async rate(userId, productId, rating) {
    try {
      // //1. get the database.
      // const db = getDb();
      // //2. get the collection.
      // const collection = db.collection(this.collection);

      // //3. removes existing entry.
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $pull: { ratings: { userId: new ObjectId(userId) } },
      //   }
      // );
      // //4. add new entry.
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $push: { ratings: { userId: new ObjectId(userId), rating } },
      //   }
      // );


      //1.check if product exists.
      const productToUpdate= await ProductModel.findById(productId);
      if(!productToUpdate){
        throw new Error('product not found');
      }

      //2.get the existing review
      const userReview= await ReviewModel.findOne({product: new ObjectId(productId)}, {user: new ObjectId(userId)});
      if(userReview){
        userReview.rating= rating,
        await userReview.save();

      }else{
       const newReview= new ReviewModel({
        product: new ObjectId(productId),
        user: new ObjectId(userId),
        rating: rating
        });

       await newReview.save();
      }

    } catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averateProductPricePerCategory(){
    try{
      const db= getDb();
     return await db.collection(this.collection).aggregate([{
      //stage 1: get average price per category.
       $group: {
        _id: "$category",
        averagePrice: {$avg: "$price"}
       }
     }]).toArray();
    }catch (err) {
      console.log("this is error: ", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
export default productRepository;
