import mongoose, { mongo } from "mongoose";

export const likeSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'types' 
    },
    types:{
        type: String,
        enum:['Product', 'Category']
    }
}).pre('save', (next)=>{
    console.log('New like is coming in');
    next();
}).post('save', (documents)=>{
    console.log('Like is saved');
   console.log(documents);
}).pre('find', (next)=>{
    console.log('Retriving likes');
    next();
}).post('find', (docs)=>{
    console.log('Find is completed');
    console.log(docs);
})