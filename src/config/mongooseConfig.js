import mongoose from "mongoose";
import { CategorySchema } from "../features/product/category.schema.js";

const url = process.env.DB_URL;
export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDb connected using mongoose");
    addCategories();
  } catch (err) {
    console.log("Error while connecting to db ", err);
  }
};

async function addCategories(){
  const CategoryModel=  mongoose.model('Category', CategorySchema);
  const categories= await CategoryModel.find();
  if(!categories || categories.length==0){
   await CategoryModel.insertMany([{name: "Books"}, {name: 'clothing'}, {name: 'electronics'}])
  }
  console.log('Categories are added');
}
