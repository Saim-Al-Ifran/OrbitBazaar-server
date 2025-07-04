import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/errors/customError";
import { TryCatch } from "../../middlewares/TryCatch";
import { createCart, deleteAllCart, deleteCartItem, findCart, updateCartItem } from "../../services/cart/cart.services";
import { deleteCache, getCache, setCache } from "../../utils/cache";
 

export const getCart =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const userEmail = req.user?.email;  
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const cachedKey = `cart_${userEmail}`;
        const cachedCart = await getCache(cachedKey);
        if(cachedCart){
            return res.json(JSON.parse(cachedCart));
        }

let cart = await findCart(userEmail);
if (!cart) {
    
    await setCache(cachedKey, null, 60);
    return res.status(200).json({
        userEmail,
        items: [],
        totalQuantity: 0,
        totalPrice: 0
    });
}
await setCache(cachedKey, cart, 60);
res.status(200).json(cart);
    }
)
export const addToCart = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { productId, quantity, price } = req.body;
    const userEmail = req.user?.email;

    if (!userEmail) {
      throw new CustomError("User not found!", 404);
    }

    const cachedKey = `cart_${userEmail}`;

    const result = await createCart(userEmail, productId, quantity, price);

    await deleteCache(cachedKey);

    // Return the dynamic message and useful info
    res.status(201).json({
      message: result.message, // "Added to cart" or "Quantity updated"
      productId: result.productId,
      updatedQuantity: result.updatedQuantity,
      cart: result.cart,
    });
  }
);

export const clearCart =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const cachedKey = `cart_${userEmail}`;
        const cart = await deleteAllCart(userEmail);
        await deleteCache(cachedKey);
        res.status(200).json(cart);
    }
)
export const editCartItem =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const { productId } = req.params;
        const { quantity } = req.body;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const cachedKey = `cart_${userEmail}`;
        const cart = await updateCartItem(userEmail, productId, quantity);
        await deleteCache(cachedKey);
        res.status(200).json(cart);
    }
)
export const removeCartItem =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const { productId } = req.params;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const cachedKey = `cart_${userEmail}`;
        const cart = await deleteCartItem(userEmail, productId);
        await deleteCache(cachedKey);
        res.status(200).json(cart);
    }
)
// export const updateCartItem =  TryCatch(
//     async(req:Request,res:Response,_next:NextFunction)=>{
//         const { productId } = req.params;
//         const userEmail = req.user?.email;
//         if(!userEmail){
//             throw new CustomError("user not found!", 404);
//         }
//         const cachedKey = `cart_${userEmail}`;
//         const cart = await deleteCartItem(userEmail, productId);
//         await deleteCache(cachedKey);
//         res.status(200).json(cart);
//     }
// )