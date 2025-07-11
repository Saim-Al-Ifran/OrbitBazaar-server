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
    if (!userEmail) {
      throw new CustomError("User not found", 404);
    }

    // Extract pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Extract sort and split
    const sortQuery = (req.query.sort as string) || "createdAt:desc";
    const [field, order] = sortQuery.split(":");
    const sortOption: Record<string, 1 | -1> = {
      [field]: order === "asc" ? 1 : -1,
    };

    // Generate a safe cache key
    const cacheKey = `orders_${userEmail}_page${page}_limit${limit}_sort_${field}_${order}`;

    const cachedOrders = await getCache(cacheKey);
    if (cachedOrders) {
      return res.json(JSON.parse(cachedOrders));
    }
    
    // Use proper paginated service
    const { data, totalRecords, totalPages, prevPage, nextPage } = await findOrdersByUserEmail(
      userEmail,
      page,
      limit,
      sortOption
    );

        // Response object
    const response = {
      success: true,
      message: "All orders fetched successfully.",
      data,
      pagination: {
        totalRecords,
        totalPages,
        prevPage,
        nextPage,
        currentPage: page,
      },
    };
    
    await setCache(cacheKey,response, 60); // cache for 60 seconds
    res.status(200).json(response);
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
      const response = {
        message:'Order retrieve successfully',
        order
      };
      await setCache(cachedKey, response,60);
      res.status(200).json(response);
    }
  );

// Update order status (Only vendor can update)
  export const changeOrderStatus = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { orderId } = req.params;
      const { status } = req.body;
      const vendorEmail = req.user?.email;
      console.log(req.body);
      console.log(status);
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

    // Sorting logic
    const sortParam = (req.query.sort as string) || "createdAt:desc";
    const [field, order] = sortParam.split(":");
    const sort: Record<string, 1 | -1> = {
      [field]: order === "asc" ? 1 : -1,
    };

    // Cache key includes sort info
    const cacheKey = `orders_${vendorEmail}_page_${page}_limit_${limit}_sort_${field}_${order}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await getVendorOrders(vendorEmail, page, limit, sort);

    const response = {
      success: true,
      message: "Orders fetched successfully.",
      data: result.data,
      pagination: {
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: page,
      },
    };

    await setCache(cacheKey, response, 60); // Cache for 60 seconds

    res.status(200).json(response);
  }
);