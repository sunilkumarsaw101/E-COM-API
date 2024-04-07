import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  desc: String,
  inStock: Number,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "review" }],
  categories:[{
    type: mongoose.Schema.Types.ObjectId, ref: "category" 
  }]
});
