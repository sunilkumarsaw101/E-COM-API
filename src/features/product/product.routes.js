//write routes for product

//1.Import express.
import express from "express";
import ProductController from "./product.controller.js";
import { uploadFile } from "../../middlewares/fileupload.middleware.js";

//2.Initialize express router.
const router = express.Router();

const productController = new ProductController();

//All the paths to controller method.
//localhost:8000/api/products

router.post('/rate', 
// productController.rateProduct 
  (req, res, next)=>{
    productController.rateProduct(req, res, next);
});

//localhost:8000/api/products/filter?minPrice=10&maxPrice=20&category=category1.
router.get('/filter', (req, res)=>{
    productController.getFilteredProduct(req, res);
});
router.get("/",   (req, res)=>{
    productController.getAllProduct(req, res);
});
router.post("/", uploadFile.single("imageUrl"), (req, res)=>{
    productController.addProduct(req, res);
});

router.get('/averagePrice', (req, res)=>{
    productController.averagePrice(req, res);
});
router.get('/:id', (req, res)=>{
    productController.getAnyOneProduct(req, res);
}  );




export default router;
