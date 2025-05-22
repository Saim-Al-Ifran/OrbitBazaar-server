import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import {
  createOrder,
  findOrdersByUserEmail,
  findOrderById,
  getVendorOrders,
  updateOrderStatus
} from "../../services/order/order.services";
import CustomError from "../../utils/errors/customError";
import { deleteCache, deleteCacheByPattern, getCache, setCache } from "../../utils/cache";

export const addOrder = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }   
        const cachedKey = `orders_${userEmail}`;
        const order = await createOrder({ userEmail, ...req.body });
        await deleteCache(cachedKey);
        await deleteCacheByPattern("orders_*");
        res.status(201).json({message:'Order placed successfully',orderId:order.id});
    }
  );

export const getUserOrders = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        } 
        const cachedKey = `orders_${userEmail}`;
        const cachedOrders = await getCache(cachedKey);
        if(cachedOrders){
          return res.json(JSON.parse(cachedOrders));
        }
        const orders = await findOrdersByUserEmail(userEmail);
        await setCache(cachedKey,orders,60);
        res.json(orders);
    }
  );

export const getUserSingleOrder = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { orderId } = req.params;
      const userEmail = req.user?.email;
      if(!userEmail){
          throw new CustomError("user not found", 404);
      }
 
      const cachedKey = `orders_${userEmail}_${orderId}`;
      const cachedOrders = await getCache(cachedKey);
      if(cachedOrders){
        return res.json(JSON.parse(cachedOrders));
      } 

      const order = await findOrderById(orderId,userEmail);

      if (!order) {
        throw new CustomError("Order not found", 404);
      }
      await setCache(cachedKey,order,60);
      res.json({message:'Order retrieve successfully',order});
    }
  );

// Update order status (Only vendor can update)
  export const changeOrderStatus = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { orderId } = req.params;
      const { status } = req.body;
      const vendorEmail = req.user?.email;
      if(!vendorEmail){
          throw new CustomError("user not found", 404);
      } 
      const cachedKey = `orders_${vendorEmail}`;
      const updatedOrder = await updateOrderStatus(orderId, vendorEmail, status);
      if (!updatedOrder){
        throw new CustomError("Not authorized to update this order",403);
        
      } 
      await deleteCache(cachedKey);
      await deleteCacheByPattern("orders_*");
      res.json(updatedOrder);
    }
  );


// Get vendor orders
export const vendorOrders = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const vendorEmail = req.user?.email;

    if (!vendorEmail) {
      throw new CustomError("User not found", 404);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const cachedKey = `orders_${vendorEmail}_page_${page}_limit_${limit}`;
    const cachedOrders = await getCache(cachedKey);

    if (cachedOrders) {
      return res.json(JSON.parse(cachedOrders));
    }

     const { data, totalRecords, totalPages, prevPage, nextPage } =
     await getVendorOrders(vendorEmail, page, limit);
    if (data.length === 0) {
      throw new CustomError("No orders found!", 404);
    }

    const response = {
      success: true,
      message: "Orders fetched successfully.",
      data,
      pagination: {
        totalRecords,
        totalPages,
        prevPage,
        nextPage,
        currentPage: page,
      },
    };

    await setCache(cachedKey, response, 60); // Cache for 60 seconds

     res.status(200).json(response);
  }
)