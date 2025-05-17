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
exports.getDashboardStatsService = void 0;
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
const User_1 = __importDefault(require("../../models/User"));
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
