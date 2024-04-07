import mongoose from "mongoose";

export const CategorySchema= new mongoose.Schema({
    name: {
        type: String,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
})