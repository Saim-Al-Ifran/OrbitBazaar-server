"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorDashboardService = exports.getDashboardStatsService = void 0;
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
const User_1 = __importDefault(require("../../models/User"));
const Report_1 = __importDefault(require("../../models/Report"));
const getDashboardStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [totalUsers, totalVendors, totalProducts, totalOrders, activeVendors, deactiveVendors, revenueAgg, monthlyRevenue, monthlySignups] = yield Promise.all([
        User_1.default.countDocuments({}),
        User_1.default.countDocuments({ role: 'vendor' }),
        Product_1.default.countDocuments({}),
        Order_1.default.countDocuments({}),
        User_1.default.countDocuments({ role: 'vendor', status: 'active' }),
        User_1.default.countDocuments({ role: 'vendor', status: 'block' }),
        Order_1.default.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]),
        Order_1.default.aggregate([
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
        User_1.default.aggregate([
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
        totalRevenue: ((_a = revenueAgg[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0,
        monthlyRevenue,
        monthlySignups
    };
});
exports.getDashboardStatsService = getDashboardStatsService;
const getVendorDashboardService = (vendorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Product Aggregation
    const productStats = yield Product_1.default.aggregate([
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
    const { totalProducts = 0, featuredProducts = 0, totalViews = 0, totalClicks = 0, productIDs = [], } = productStats[0] || {};
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
    const chartDataAgg = yield Order_1.default.aggregate([
        {
            $match: {
                'items.productID': { $in: productIDs },
                createdAt: { $type: 'date' } // ✅ Ensure createdAt is a Date
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
    const monthLabels = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() + 1 - i, 1);
        const label = date.toISOString().slice(0, 7);
        monthLabels.push(label);
    }
    console.log(monthLabels);
    console.log(chartDataAgg);
    // Convert chartDataAgg to a Map for quick lookup
    const chartMap = new Map(chartDataAgg.map(item => [item._id.month, item.monthlyRevenue]));
    //console.log("chartMap",chartMap);
    // Fill missing months with 0 revenue 
    const chartData = monthLabels.map(month => ({
        month,
        revenue: chartMap.get(month) || 0,
    }));
    console.log("charData", chartData);
    // 3. Total Revenue and Sales (Overall)
    const overallStats = yield Order_1.default.aggregate([
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
    const pendingReports = yield Report_1.default.countDocuments({
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
});
exports.getVendorDashboardService = getVendorDashboardService;
