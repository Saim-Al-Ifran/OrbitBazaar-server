import { TryCatch } from "../../middlewares/TryCatch";
import {Response,Request,NextFunction } from "express";
import {
    createWishlist,
    deleteAllWishlist,
    deleteProductFromWishlist,
    findWishlist
} from "../../services/wishlist/wishlist.services";
import CustomError from "../../utils/errors/customError";
import { deleteCache, getCache, setCache } from "../../utils/cache";

export const addToWishlist =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const { productId } = req.body;
        const userEmail = req.user?.email; 
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const wishlist = await createWishlist(userEmail, productId );
        await deleteCache(`wishlist_${userEmail}`);
        res.status(200).json({ message: "Product added to wishlist", wishlist });
    }
)
export const getAllWishlist =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const cachedKey = `wishlist_${userEmail}`;
        const cachedWishlist = await getCache(cachedKey);
        if(cachedWishlist){
            return res.json(JSON.parse(cachedWishlist));
        }

        const wishlist = await findWishlist(userEmail);
        await setCache(cachedKey,wishlist,60);

        res.status(200).json(wishlist);
    }
)
export const removeProductFromWishlist =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const userEmail = req.user?.email;
        const { productId } = req.params;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const updatedWishlist = await deleteProductFromWishlist(userEmail, productId);
        await deleteCache(`wishlist_${userEmail}`);
        res.status(200).json({ message: "Product removed from wishlist", wishlist: updatedWishlist });
    
    }
)
export const removeAllProductFromWishlist =  TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found!", 404);
        }
        const wishlistResponse =  await  deleteAllWishlist(userEmail);
        await deleteCache(`wishlist_${userEmail}`);
        res.status(200).json({ message: "Wishlist cleared",wishlist:wishlistResponse  });
    
    }
)