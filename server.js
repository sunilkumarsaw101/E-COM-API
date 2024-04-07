import "./env.js";
//1. Import express.
import express from "express";

import cors from "cors";
import swagger from "swagger-ui-express";
import ProductRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import UserRouter from "./src/features/user/user.routes.js";
import CartRouter from "./src/features/cart/cart.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";

import apiDocs from "./swagger.json" assert {type: 'json'};
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import OrderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import { Likerouter } from "./src/features/like/like.routes.js";
// import db from "./src/config/mongodb.js";
//2.Create express server instance.
const server = new express();

//cors policy configurations.
//using cors libray.
const corsOptions = {
  origin: "http://localhost:5500",
};
server.use(cors(corsOptions));

//without cors libray.
// server.use((req, res, next) => {
//   //for all origin use *
//   res.header("Access-Control-Allow-Origin", "*");

//   //for the origin  http://localhost:5500
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   //allowing all headers
//   res.header("Access-Control-Allow-Headers", "*");
//   //allowing all methods
//   res.header("Access-Control-Allow-Methods", "*");

//   //return OK for preflight request.
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

//configure body parser middleware to parse the data in req body.
server.use(bodyParser.json());
server.use(express.json());

//for swagger req
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

//for logging all request
// server.use(loggerMiddleware);

//for all the request related to product, redirect to product route.
//localhost:8000/api/products
server.use("/api/products", jwtAuth, ProductRouter);

//for all the request related to user, redirect to user route.
server.use("/api/users", UserRouter);

//for all the request related to cart, redirect to cart route.
server.use("/api/cartItems", jwtAuth, CartRouter);

//for all the request related to order, redirect to order route.
server.use("/api/orders", jwtAuth, OrderRouter );

//for all the request related to likes, redirect to like route.
 server.use('/api/likes', jwtAuth, Likerouter)

 //3.Default req handlers.
server.get("/", (req, res) => {
  res.send("welcome to expressJs");
});

//4.middleware to handle 404 requests.
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found, please check our documentation for more information at localhost:8000/api-docs"
    );
});

//Error handler middleware.
server.use((err, req, res, next) => {
  // console.log("the error ", err);
  // loggerMiddleware(req, err, res, next);
  if(err instanceof mongoose.Error.ValidationError){
    // console.log(err);
   return res.status(400).send(err.message);

  }
  //user error
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  //server error
  res.status(500).send("Something went wrong, please try later");
});



//5.Specify port Number.
server.listen("8000", () => {
  console.log("server is listening on 8000");
  // connectToMongoDB();
  connectUsingMongoose();
});
