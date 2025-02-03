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
exports.editReportStatus = exports.getReportCountByProduct = exports.getReportsByUser = exports.editReport = exports.removeReport = exports.getReportById = exports.getReportsByProduct = exports.getReportsByVendor = exports.addReport = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const report_services_1 = require("../../services/report/report.services");
exports.addReport = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { productId, comment, reason } = req.body;
    if (!userEmail) {
        throw new customError_1.default("User not found", 404);
    }
    const report = yield (0, report_services_1.createReport)(productId, userEmail, comment, reason);
    res.status(201).json({
        message: "Report submitted successfully.",
        reportId: report.id
    });
}));
exports.getReportsByVendor = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const reports = yield (0, report_services_1.findReportsByVendor)(vendorEmail);
    res.status(200).json(reports);
}));
exports.getReportsByProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const reports = yield (0, report_services_1.findReportsByProduct)(productId);
    res.status(200).json(reports);
}));
exports.getReportById = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    const report = yield (0, report_services_1.findReportById)(reportId);
    if (!report)
        return res.status(404).json({ message: 'Report not found' });
    res.status(200).json(report);
}));
exports.removeReport = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reportId } = req.params;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const deletedReport = yield (0, report_services_1.deleteReport)(reportId, userEmail);
    if (!deletedReport) {
        throw new customError_1.default('Not authorized to delete this report', 403);
    }
    res.status(200).json({ message: 'Report deleted successfully' });
}));
exports.editReport = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    const updatedReport = yield (0, report_services_1.updateReport)(reportId, req.body);
    if (!updatedReport)
        return res.status(400).json({ message: 'Cannot update resolved/rejected report' });
    res.status(200).json(updatedReport);
}));
exports.getReportsByUser = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const reports = yield (0, report_services_1.findReportsByUser)(userEmail);
    res.status(200).json(reports);
}));
exports.getReportCountByProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const count = yield (0, report_services_1.findReportCountByProduct)(productId);
    res.status(200).json({ productId, count });
}));
exports.editReportStatus = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    const { status } = req.body;
    if (!['solved', 'unsolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }
    const updatedReport = yield (0, report_services_1.updateReportStatus)(reportId, status);
    res.status(200).json(updatedReport);
}));
