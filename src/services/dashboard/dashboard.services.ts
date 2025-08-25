import Order from "../../models/Order";
import Product from "../../models/Product";
import User from "../../models/User";
import Report from "../../models/Report";
import Review from "../../models/Review";
 

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

export const getVendorDashboardService = async (vendorEmail: string) => {
  // 1. Product Aggregation
  const productStats = await Product.aggregate([
    { $match: { vendorEmail } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        featuredProducts: {
          $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] },
        },
        totalViews: { $sum: '$analytics.views' },
        totalClicks: { $sum: '$analytics.clicks' },
        productIDs: { $addToSet: '$_id' },
      },
    },
  ]);

  const {
    totalProducts = 0,
    featuredProducts = 0,
    totalViews = 0,
    totalClicks = 0,
    productIDs = [],
  } = productStats[0] || {};

  if (productIDs.length === 0) {
    return {
      totalProducts,
      featuredProducts,
      totalViews,
      totalClicks,
      totalSales: 0,
      totalRevenue: 0,
      pendingReports: 0,
      chartData: [],
    };
  }

  // 2. Revenue and Chart Data (Monthly)
const chartDataAgg = await Order.aggregate([
  {
    $match: {
      'items.productID': { $in: productIDs },
      createdAt: { $type: 'date' }  // ✅ Ensure createdAt is a Date
    },
  },
  { $unwind: '$items' },
  {
    $match: {
      'items.productID': { $in: productIDs },
    },
  },
  {
    $group: {
      _id: { month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } } },
      monthlyRevenue: { $sum: '$items.total' },
    },
  },
  { $sort: { '_id.month': 1 } },
]);

// Generate last 12 months labels (format: YYYY-MM)
 

const monthsToShow = 12;
const now = new Date();
const monthLabels: string[] = [];

for (let i = monthsToShow - 1; i >= 0; i--) {
  const date = new Date(now.getFullYear(), now.getMonth() + 1 - i, 1);
  const label = date.toISOString().slice(0, 7);
  monthLabels.push(label);
}

console.log(monthLabels);
console.log(chartDataAgg)

// Convert chartDataAgg to a Map for quick lookup
const chartMap = new Map(chartDataAgg.map(item => [item._id.month, item.monthlyRevenue]));
 
//console.log("chartMap",chartMap);
// Fill missing months with 0 revenue 
const chartData = monthLabels.map(month => ({
  month,
  revenue: chartMap.get(month) || 0,
}));
 console.log("charData",chartData);
  // 3. Total Revenue and Sales (Overall)
  const overallStats = await Order.aggregate([
    { $match: { 'items.productID': { $in: productIDs } } },
    { $unwind: '$items' },
    { $match: { 'items.productID': { $in: productIDs } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$items.total' },
        totalSales: { $sum: '$items.quantity' },
      },
    },
  ]);

  const { totalRevenue = 0, totalSales = 0 } = overallStats[0] || {};

  // 4. Pending Reports
  const pendingReports = await Report.countDocuments({
    productID: { $in: productIDs },
    status: 'pending',
  });

  return {
    totalProducts,
    featuredProducts,
    totalViews,
    totalClicks,
    totalSales,
    totalRevenue,
    pendingReports,
    chartData,
  };
};


export const getUserDashboardService = async (userId: string, userEmail: string) => {
  // 1. Total Orders
  const totalOrders = await Order.countDocuments({ userEmail });

  // 2. Pending Orders (confirmed + processing)
  const pendingOrders = await Order.countDocuments({
    userEmail,
    status: { $in: ["confirmed", "processing"] },
  });

  // 3. Total Spent
  const totalSpentAgg = await Order.aggregate([
    { $match: { userEmail, status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalSpent = totalSpentAgg.length > 0 ? totalSpentAgg[0].total : 0;

  // 4. Reviews Submitted
  const reviewsSubmitted = await Review.countDocuments({ user: userId });

  // 5. Last 3 Orders
  const recentOrders = await Order.find({ userEmail })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("items totalPrice status createdAt")
    .populate("items.productID", "name images status createdAt");
 

  // 6. Spending Trend (monthly)
    const spendingTrend = await Order.aggregate([
      { $match: { userEmail, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$createdAt" } },
            month: { $month: { $toDate: "$createdAt" } },
          },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const chartData = spendingTrend.map((entry) => ({
      month: `${entry._id.month}-${entry._id.year}`,
      total: entry.totalSpent,
    }));

 

  return {
    totalOrders,
    pendingOrders,
    totalSpent,
    reviewsSubmitted,
    recentOrders,
    chartData,
  };
};