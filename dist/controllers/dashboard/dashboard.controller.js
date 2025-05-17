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
exports.getDashboardStatsController = void 0;
const dashboard_services_1 = require("../../services/dashboard/dashboard.services");
const TryCatch_1 = require("../../middlewares/TryCatch");
exports.getDashboardStatsController = (0, TryCatch_1.TryCatch)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield (0, dashboard_services_1.getDashboardStatsService)();
    res.status(200).json({
        success: true,
        message: 'Dashboard statistics fetched successfully',
        data: stats
    });
}));
