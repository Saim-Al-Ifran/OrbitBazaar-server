import { FilterQuery } from "mongoose";
import Order from "../../models/Order";
import { IOrder } from "../../types/models/Order";
import Product from "../../models/Product";
import paginate from "../../utils/paginate";

// Create a new order
export const createOrder = async (orderData: IOrder) => {
    const newOrder = new Order(orderData);
    return await newOrder.save();
  };

// Get orders by user email
export const findOrdersByUserEmail = async (userEmail: string) => {
    return await Order.find({ userEmail });
  };

// Get order by ID
export const findOrderById = async (orderId: string,userEmail:string) => {
    console.log({orderId,userEmail});
    
    return await Order.findOne({_id:orderId,userEmail}).populate('items.productID');
  };

  // Update order status (only if vendor owns the product)
export const updateOrderStatus = async (orderId: string, vendorEmail: string, status: string) => {
    const order = await Order.findById(orderId).populate('items.productID');
    if (!order) return null;
  
    const isVendorAuthorized = order.items.every(item => item.productID.vendorEmail === vendorEmail);
    if (!isVendorAuthorized) return null;
  
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  };

  // Cancel order (only if vendor owns the product)
export const cancelOrder = async (orderId: string, vendorEmail: string) => {
    const order = await Order.findById(orderId).populate('items.productID');
    if (!order) return null;
  
    const isVendorAuthorized = order.items.every(item => item.productID.vendorEmail === vendorEmail);
    if (!isVendorAuthorized) return null;
  
    return await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' }, { new: true });
  };
  
// Get all orders (for admin or vendor-specific filtering)
export const getAllOrders = async (filter: FilterQuery<IOrder> = {}) => {
    return await Order.find(filter).populate('items.productID');
  };

// Get vendor orders (orders containing vendor's products)
export const getVendorOrders = async (
  vendorEmail: string,
  page: number,
  limit: number
) => {
  const products = await Product.find({ vendorEmail }).select("_id");
  const productIds = products.map((product) => product._id);

  if (!productIds.length) {
    return {
      data: [],
      totalRecords: 0,
      totalPages: 0,
      prevPage: null,
      nextPage: null,
      page,
    };
  }

  return await paginate(
    Order,
    { "items.productID": { $in: productIds } },
    page,
    limit,
    { createdAt: -1 }, // optional sorting
    "", // projection
    "items.productID" // populate
  );
};