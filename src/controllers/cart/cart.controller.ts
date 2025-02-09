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

        const cart = await findCart(userEmail);
        if(!cart || cart.items.length === 0){
            throw new CustomError("No data found in the cart!", 404);
        }
        await setCache(cachedKey,cart,60);
        res.status(200).json(cart);
    }
)
export const addToCart =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const { productId, quantity, price } = req.body;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const cachedKey = `cart_${userEmail}`;
        const cart = await createCart(userEmail, productId, quantity, price);
        await deleteCache(cachedKey);
        res.status(201).json(cart);
    }
)
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