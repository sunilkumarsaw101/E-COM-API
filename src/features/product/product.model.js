import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";
export default class ProductModel {
  constructor( _name, _desc, _imageUrl, _category, _price, _sizes, _id,) {
    this._id = _id;
    this.name = _name;
    this.price = _price;
    this.sizes = _sizes;
    this.imageUrl = _imageUrl;

    this.desc = _desc;
    this.categories = _category;
  }

  static getAllProduct() {
    return products;
  }
  static addProd(productData) {
    //  const {name, desc, imageUrl, category, price, sizes}= data;
    // let newProd= new ProductModel(products.length+1, name, desc, imageUrl, category, price, sizes);
    // products.push(newProd);
    productData.id = products.length + 1;
    products.push(productData);
    return products;
  }

  static getAnyOneProduct(productId) {
    return products.find((prod) => prod.id == productId);
  }
  static filter(minPrice, maxPrice, category) {
    let result = products.filter((prod) => {
      return (
        (!minPrice || prod.price >= minPrice) &&
        (!maxPrice || prod.price <= maxPrice) &&
        (!category || prod.category == category)
      );
    });
    return result;
  }

  static rateProduct(userId, productId, rating) {
    //1.validate user and product
    const product = products.find((prod) => prod.id == productId);
    if (!product) {
      //user defined error.
      throw new ApplicationError('Product Not Found', 404);
    }
    //validate user
    const users = UserModel.getAllUsers().find((u) => u.id == userId);
    if (!users) {
      //user defined error.
      throw new ApplicationError('User Not Found', 400);
    }

    //2. check if there are any rating for this product if there is not, then add the rating.

    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userId: userId,
        rating: rating,
      });
    } else {
      // check if this user rated before.
      const existingRatingIndex = product.ratings.findIndex(
        (u) => u.userId == userId
      );
      // if yes then update the rating with new rating.
      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = {
          userId: userId,
          rating: rating,
        };
      } else {
        // if not then add the rating for this user.
        product.ratings.push({ userId: userId, rating: rating });
      }
    }
  }
}

var products = [
  new ProductModel(
    1,
    "iphone15",
    "iphone 15 pro max",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfA-ixomPNoqO-etGGn9v757mstnJC_GUzomSCroxSQ-MNOIN3ZrjPBTOip0T7Uc9wg0U&usqp=CAU",
    "category1",
    10,
    ["mini", "standard", "large"]
  ),
  new ProductModel(
    2,
    "bmw",
    "bmw in black for royals",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfA-ixomPNoqO-etGGn9v757mstnJC_GUzomSCroxSQ-MNOIN3ZrjPBTOip0T7Uc9wg0U&usqp=CAU",
    "category2",
    20
  ),
  new ProductModel(
    3,
    "royal Enfield",
    "royal enfield in black for royals",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfA-ixomPNoqO-etGGn9v757mstnJC_GUzomSCroxSQ-MNOIN3ZrjPBTOip0T7Uc9wg0U&usqp=CAU",
    "category2",
    25
  ),
];
