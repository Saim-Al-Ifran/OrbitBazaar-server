import mongoose from "mongoose";
import Cart from "../../models/Cart";
import { ICart } from "../../types/models/Cart";

// Fetch the current cart for the authenticated user.
export const findCart = async (userEmail: string): Promise<ICart | null> => {
    return await Cart.findOne({ userEmail }).populate("items.productID");
  };

// Add a product to the cart. 
export const createCart = async (userEmail: string, productID: string, quantity: number, price: number) => {
    let cart = await Cart.findOne({ userEmail });
  
    if (!cart) {
      cart = new Cart({ userEmail, items: [], totalQuantity: 0, totalPrice: 0 });
    }
  
    const existingItem = cart.items.find((item) => item.productID.toString() === productID);
  
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * price;
    } else {
      cart.items.push({ productID: new mongoose.Types.ObjectId(productID), quantity, price, total: quantity * price });
    }
  
    cart.totalQuantity += quantity;
    cart.totalPrice += quantity * price;
  
    await cart.save();
    return cart;
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