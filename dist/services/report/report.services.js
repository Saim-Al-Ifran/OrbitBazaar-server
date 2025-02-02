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
exports.updateReportStatus = exports.findReportCountByProduct = exports.findReportsByUser = exports.updateReport = exports.deleteReport = exports.findReportById = exports.findReportsByProduct = exports.findReportsByVendor = exports.createReport = void 0;
const Report_1 = __importDefault(require("../../models/Report"));
// Create a new report
const createReport = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.create(data);
});
exports.createReport = createReport;
// Get all reports for a vendor's products
const findReportsByVendor = (vendorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.find({ 'product.vendorEmail': vendorEmail }).populate('productID');
});
exports.findReportsByVendor = findReportsByVendor;
// Get all reports for a specific product
const findReportsByProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.find({ productID: productId });
});
exports.findReportsByProduct = findReportsByProduct;
// Get a report by its ID
const findReportById = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.findById(reportId);
});
exports.findReportById = findReportById;
// Delete a report (only the user who submitted it or the vendor can delete)
const deleteReport = (reportId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.findOneAndDelete({ _id: reportId, userEmail });
});
exports.deleteReport = deleteReport;
// Update a report's comment or reason (only if status is not resolved or rejected)
const updateReport = (reportId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.findOneAndUpdate({ _id: reportId, status: { $nin: ['resolve', 'reject'] } }, data, { new: true });
});
exports.updateReport = updateReport;
// Get all reports submitted by a specific user
const findReportsByUser = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.find({ userEmail });
});
exports.findReportsByUser = findReportsByUser;
// Get the count of reports for a specific product
const findReportCountByProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.countDocuments({ productID: productId });
});
exports.findReportCountByProduct = findReportCountByProduct;
// Update the status of a report (only for vendors)
const updateReportStatus = (reportId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.findByIdAndUpdate(reportId, { status }, { new: true });
});
exports.updateReportStatus = updateReportStatus;
