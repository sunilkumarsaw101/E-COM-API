export default class CartModel {
  constructor(productId, userId, quantity, id) {
    this.productId = productId;
    this.userId = userId;
    this.quantity = quantity;
    // this._id = id;
  }

  static add(productId, userId, quantity) {
    let newItem = new CartModel(productId, userId, quantity);
    newItem.id = cartItems.length + 1;
    cartItems.push(newItem);
    return newItem;
  }

  static getAllCartItems(userId){
     const item= cartItems.filter(item=>item.userId==userId);
     return item;
  }

  static deleteCartItem(cartItemId, userId){
      const cartItemIndex= cartItems.findIndex(i=>i.id==cartItemId && i.userId==userId);
      if(cartItemIndex>=0){
        cartItems.splice(cartItemIndex,1);
      }else{
        return 'Item Not Found';

      }
  }
}

const cartItems = [new CartModel(1, 1, 2, 1)];
