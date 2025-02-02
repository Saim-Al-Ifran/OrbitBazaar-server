import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import {
  createOrder,
  findOrdersByUserEmail,
  getOrderById,
  getVendorOrders,
  updateOrderStatus
} from "../../services/order/order.services";
import CustomError from "../../utils/errors/customError";

export const addOrder = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }   
        const order = await createOrder({ userEmail, ...req.body });
        res.status(201).json({message:'Order placed successfully',orderId:order.id});
    }
  );

export const getUserOrders = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        } 
      const orders = await findOrdersByUserEmail(userEmail);
      res.json(orders);
    }
  );

export const getSingleOrder = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { orderId } = req.params;
      const order = await getOrderById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
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
      const updatedOrder = await updateOrderStatus(orderId, vendorEmail, status);
      if (!updatedOrder){
        throw new CustomError("Not authorized to update this order",403);
        
      } 
      res.json(updatedOrder);
    }
  );


// Get vendor orders
  export const vendorOrders = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const vendorEmail = req.user?.email;
      if(!vendorEmail){
          throw new CustomError("user not found", 404);
      } 
      const orders = await getVendorOrders(vendorEmail);
      res.json(orders);
    }
  );