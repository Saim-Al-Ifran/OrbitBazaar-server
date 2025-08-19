import mongoose from "mongoose";
import Cart from "../../models/Cart";
import { ICart } from "../../types/models/Cart";
import { findProductById } from "../product/product.services";

// Fetch the current cart for the authenticated user.
export const findCart = async (userEmail: string): Promise<ICart | null> => {
    return await Cart.findOne({ userEmail }).populate({
      path:"items.productID",
      select: "price images name stock",
    });
  };

// Add a product to the cart. 
export const createCart = async (
  userEmail: string,
  productID: string,
  quantity: number,
  price: number
) => {
  let cart = await Cart.findOne({ userEmail });

  if (!cart) {
    cart = new Cart({ userEmail, items: [], totalQuantity: 0, totalPrice: 0 });
  }

  const existingItem = cart.items.find(
    (item) => item.productID.toString() === productID
  );

  let message = '';
  let updatedQuantity = quantity;

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * price;
    updatedQuantity = existingItem.quantity;
    message = 'Quantity updated';
  } else {
    cart.items.push({
      productID: new mongoose.Types.ObjectId(productID),
      quantity,
      price,
      total: quantity * price,
    });
    message = 'Added to cart';
  }

  // Recalculate total quantity and price
  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);

  await cart.save();

  return {
    message,
    productId: productID,
    updatedQuantity,
    cart,
  };
};

  
  // Remove all items from the cart.

  export const deleteAllCart = async (userEmail: string) => {
    return await Cart.findOneAndUpdate({ userEmail }, { items: [], totalQuantity: 0, totalPrice: 0 }, { new: true });
  };
  
  /**
   * Update the quantity of a specific product in the cart.
   * If quantity is 0, the item is removed.
   */
export const updateCartItem = async (userEmail: string, productID: string, quantity: number) => {
  const cart = await Cart.findOne({ userEmail });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((item) => item.productID.toString() === productID);
  if (!item) throw new Error("Item not found in cart");

  // Fetch the actual product to check stock
  const product = await findProductById(productID);
  if (!product) throw new Error("Product not found");

  if (quantity > product.stock) {
    throw new Error(`Sorry, only ${product.stock} unit${product.stock > 1 ? 's' : ''} are available in stock.`);
  }

  if (quantity === 0) {
    cart.items = cart.items.filter((item) => item.productID.toString() !== productID);
  } else {
    item.quantity = quantity;
    item.total = item.quantity * item.price;
  }

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);

  await cart.save();
  return cart;
};
  
   
  //  Remove a specific product from the cart.
    
  export const deleteCartItem = async (userEmail: string, productID: string) => {
    const cart = await Cart.findOne({ userEmail });
  
    if (!cart) throw new Error("Cart not found");
  
    cart.items = cart.items.filter((item) => item.productID.toString() !== productID);
  
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
  
    await cart.save();
    return cart;
  };


export const updateCartItemQuantity = async (
  userEmail: string,
  productId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({ userEmail });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(item =>
    item.productID.toString() === productId
  );

  if (itemIndex === -1) {
    throw new Error("Product not found in cart");
  }

  // Update the quantity
  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;

  // Recalculate totalQuantity and totalPrice
  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);

  await cart.save();
  return cart;
};