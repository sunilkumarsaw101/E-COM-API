import ProductModel from "./product.model.js";
import productRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepo = new productRepository();
  }
  async getFilteredProduct(req, res) {
    try{

      console.log("helo");
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = await this.productRepo.filter(minPrice, maxPrice, category);
      res.status(200).send(result);
    }catch(err){
      console.log(err);
      // return res.status(400).send("Something went wrong");
      return res.status(400).send("Something went wrong");

    }
  }
  async getAllProduct(req, res) {
    try {
      // let products = ProductModel.getAllProduct();
      let products = await this.productRepo.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }
  async getAnyOneProduct(req, res) {
    try {
      const productId = req.params.id;
      // let productFound = ProductModel.getAnyOneProduct(productId);
      let productFound = await this.productRepo.getAnyOneProduct(productId);
      if (productFound) {
        res.status(200).send(productFound);
      } else {
        res.status(404).send("product is not found");
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      console.log(req.body);
      const { name, price, sizes, categories, description } = req.body;
      //  console.log(categories);
      const newProduct = new ProductModel(
        name,
        description,
        req?.file?.filename,

        categories,
        parseFloat(price),
        sizes?.split(",")
      );

      // const newProduct= {
      //   name: name,
      //   price: parseFloat(price),
      //   sizes: sizes.split(","),
      //   imageUrl: req.file.filename,
      // };
      // console.log(name);
      // console.log('data received');
      // const newRecords = ProductModel.addProd(newProduct);

      // let products= ProductModel.getAllProduct();
      // console.log(products);
      const newRecords = await this.productRepo.add(newProduct);
      console.log(newRecords);
      res.status(201).send(newRecords);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }

 async rateProduct(req, res, next) {
    //handle error in controller.
    try {
      // const userId = req.query.userId;

      //now userId fetching from req, which is added in jwt middleware.
      const userId= req.userId;
      
      // const productId = req.query.productId;
      // const rating = req.query.rating;

      const {productId, rating}= req.body;

      // try{
      // ProductModel.rateProduct(userId, productId, rating);
     await this.productRepo.rate(userId, productId, rating);
      // }catch(error){
      // res.status(400).send(error.message);
      // }
      res.status(200).send("rated successfully");

      // const error= ProductModel.rateProduct(userId, productId, rating);
      // if(error){
      //   res.status(400).send(error);
      // }else{
      //   res.status(200).send('rated successfully');
      // }
    } catch (err) {
      console.log("passing error to middleware");
      //passing error to middleware
      next(err);
    }
  }

  async averagePrice(req, res, next){
    try{
      const result= await  this.productRepo.averateProductPricePerCategory();
      res.status(200).send(result);

    }catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }
}
