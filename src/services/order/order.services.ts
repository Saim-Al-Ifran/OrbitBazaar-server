import { FilterQuery } from "mongoose";
import Order from "../../models/Order";
import { IOrder } from "../../types/models/Order";
import Product from "../../models/Product";
import paginate from "../../utils/paginate";
import { PaginationResult } from "../../types/types";

// Create a new order
export const createOrder = async (orderData: IOrder) => {
    const newOrder = new Order(orderData);
    return await newOrder.save();
  };

// Get orders by user email
export const findOrdersByUserEmail = async (
  userEmail: string,
  page: number,
  limit: number,
  sort: Record<string, number>
): Promise<PaginationResult<IOrder>> => {
  return await paginate(Order, { userEmail }, page, limit, sort);
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
  limit: number,
  sort: Record<string, 1 | -1>  
) => {
  const products = await Product.find({ vendorEmail }).select("_id");
  const productIds = products.map((product) => product._id);


  return await paginate(
    Order,
    { "items.productID": { $in: productIds } },
    page,
    limit,
    sort,          
    "",             // projection
    "items.productID"
  );
};



export const getUniquePurchasedProducts = async (
  userEmail: string,
  page: number,
  limit: number,
  sort: Record<string, 1 | -1>
) => {
  // Fetch all orders for the user and populate only product IDs
  const orders = await Order.find({ userEmail }).select('items.productID');
 
  const uniqueProductIds = new Set<string>();

  for (const order of orders) {
    for (const item of order.items) {
      const productId = item.productID.toString();
      uniqueProductIds.add(productId);
    }
  }

  const uniqueIdsArray = Array.from(uniqueProductIds);

  // Use paginate utility to return products by unique IDs
  const paginatedProducts = await paginate(
    Product,
    { _id: { $in: uniqueIdsArray } },
    page,
    limit,
    sort,
  );

  return paginatedProducts;
};