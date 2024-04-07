import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import CartModel from "./cart.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export default class CartController{
    constructor(){
        this.cartRepo= new CartItemsRepository();
    }
     async addToCart(req, res){
        try{

            // console.log('object');
            const{productId, quantity}= req.body;
            const userId= req.userId;
            // CartModel.add(productId, userId, quantity);
            
            await this.cartRepo.add(productId, userId, quantity);
            res.status(201).send('Cart Updated Successfully');
        }catch(err){
            console.log("this is error: ", err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getAllCartItems(req, res){
        try{
            const userId= req.userId;
            // const items= CartModel.getAllCartItems(userId);
            const cartItems= await this.cartRepo.getAllCartItems(userId);
            res.status(200).send(cartItems);
        }catch(err){
            console.log("this is error: ", err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async deleteCartItem(req, res){
        try{
            console.log('hlooo');
            //userId is added in req in middleware.
            const userId= req.userId;
            const cartItemId= req.params.cartItemId;
    
            // const error= CartModel.deleteCartItem(cartItemId, userId);
            const isDeleted= await this.cartRepo.deleteCartItem(userId, cartItemId);
            if(!isDeleted){
              return res.status(404).send('Item not found');
            }else{
               return res.status(200).send('Cart Item Removed');
            }
        }catch(err){
            console.log("this is error: ", err);
            throw new ApplicationError("Something went wrong with database", 500);
        }

    }
}