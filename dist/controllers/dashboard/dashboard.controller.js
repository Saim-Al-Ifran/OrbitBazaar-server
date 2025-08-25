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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboardStats = exports.getVendorDashboardStats = exports.getDashboardStats = void 0;
const dashboard_services_1 = require("../../services/dashboard/dashboard.services");
const TryCatch_1 = require("../../middlewares/TryCatch");
exports.getDashboardStats = (0, TryCatch_1.TryCatch)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield (0, dashboard_services_1.getDashboardStatsService)();
    res.status(200).json({
        success: true,
        message: 'Dashboard statistics fetched successfully',
        data: stats
    });
}));
exports.getVendorDashboardStats = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        return res.status(400).json({ message: 'Vendor email is required' });
    }
    const dashboardData = yield (0, dashboard_services_1.getVendorDashboardService)(vendorEmail);
    res.status(200).json(dashboardData);
}));
exports.getUserDashboardStats = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    if (!userEmail) {
        return res.status(400).json({ message: 'User email is required' });
    }
    const dashboardData = yield (0, dashboard_services_1.getUserDashboardService)(userId, userEmail);
    res.status(200).json(dashboardData);
}));
