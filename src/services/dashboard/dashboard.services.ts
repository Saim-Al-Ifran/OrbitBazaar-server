import Order from "../../models/Order";
import Product from "../../models/Product";
import User from "../../models/User";

 

export const getDashboardStatsService = async () => {
  const [
    totalUsers,
    totalVendors,
    totalProducts,
    totalOrders,
    activeVendors,
    deactiveVendors,
    revenueAgg,
    monthlyRevenue,
    monthlySignups
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'vendor' }),
    Product.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({ role: 'vendor', status: 'active' }),
    User.countDocuments({ role: 'vendor', status: 'block' }),
    Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  return {
    totalUsers,
    totalVendors,
    totalProducts,
    totalOrders,
    activeVendors,
    deactiveVendors,
    totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    monthlyRevenue,
    monthlySignups
  };
};
