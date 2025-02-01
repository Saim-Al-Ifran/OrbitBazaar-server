import { FilterQuery } from "mongoose";
import Order from "../../models/Order";
import { IOrder } from "../../types/models/Order";
import Product from "../../models/Product";

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
export const getOrderById = async (orderId: string) => {
    return await Order.findById(orderId).populate('items.productID');
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
export const getVendorOrders = async (vendorEmail: string) => {
    const products = await Product.find({ vendorEmail });
    const productIds = products.map(product => product._id);
    return await Order.find({ 'items.productID': { $in: productIds } }).populate('items.productID');
  };
  