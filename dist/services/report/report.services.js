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
exports.findReportByIdForVendor = exports.updateReportStatus = exports.findReportCountByProduct = exports.findReportByUser = exports.findAllReportsByUser = exports.updateReport = exports.deleteReport = exports.findReportById = exports.findReportsByProduct = exports.findReportsByVendor = exports.createReport = void 0;
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
const Report_1 = __importDefault(require("../../models/Report"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const paginate_1 = __importDefault(require("../../utils/paginate"));
// Create a new report
const createReport = (productID, userEmail, comment, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const hasPurchased = yield Order_1.default.findOne({
        userEmail,
        'items.productID': productID
    });
    if (!hasPurchased) {
        throw new customError_1.default('You can only report products you have purchased.', 403);
    }
    console.log({ userEmail, productID, });
    return yield Report_1.default.create({ userEmail, productID, comment, reason });
});
exports.createReport = createReport;
// Get all reports for a vendor's products
const findReportsByVendor = (vendorEmail_1, page_1, limit_1, status_1, ...args_1) => __awaiter(void 0, [vendorEmail_1, page_1, limit_1, status_1, ...args_1], void 0, function* (vendorEmail, page, limit, status, sort = { createdAt: -1 }) {
    // Find all products owned by this vendor
    const products = yield Product_1.default.find({ vendorEmail }).select("_id");
    if (!products.length) {
        throw new customError_1.default("No products found for this vendor", 404);
    }
    const productIds = products.map((p) => p._id);
    // Build filter query
    const filter = {
        productID: { $in: productIds },
    };
    if (status) {
        filter.status = status;
    }
    return yield (0, paginate_1.default)(Report_1.default, filter, page, limit, sort, "", "productID");
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
    const report = yield Report_1.default.findOne({ _id: reportId, userEmail });
    if (!report) {
        throw new customError_1.default("Report not found or you don't have permission to delete it.", 403);
    }
    yield Report_1.default.findByIdAndDelete(reportId);
    return { message: "Report deleted successfully." };
});
exports.deleteReport = deleteReport;
// Update a report's comment or reason (only if status is not resolved or rejected)
const updateReport = (reportId, userEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield Report_1.default.findOne({ _id: reportId, userEmail });
    if (!report) {
        throw new customError_1.default("Report not found or you don't have permission to update it.", 403);
    }
    if (report.status === "resolve" || report.status === "reject") {
        throw new customError_1.default("Cannot update a resolved or rejected report.", 400);
    }
    return yield Report_1.default.findByIdAndUpdate(reportId, data, { new: true });
});
exports.updateReport = updateReport;
// Get all reports submitted by a specific user
const findAllReportsByUser = (userEmail, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, paginate_1.default)(Report_1.default, { userEmail }, page, limit, { createdAt: -1 }, "", "productID");
});
exports.findAllReportsByUser = findAllReportsByUser;
// Get a specific  reports submitted by a  user
const findReportByUser = (reportId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield Report_1.default.findById(reportId);
    if (!report) {
        throw new customError_1.default("Report not found", 404);
    }
    if (report.userEmail !== userEmail) {
        throw new customError_1.default("You are not authorized to view this report", 403);
    }
    return report;
});
exports.findReportByUser = findReportByUser;
// Get the count of reports for a specific product
const findReportCountByProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Report_1.default.countDocuments({ productID: productId });
});
exports.findReportCountByProduct = findReportCountByProduct;
// Update the status of a report (only for vendors)
const updateReportStatus = (vendorEmail, reportId, status) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the report
    const report = yield Report_1.default.findById(reportId);
    if (!report) {
        throw new customError_1.default("Report not found", 404);
    }
    // Find the product associated with this report
    const product = yield Product_1.default.findById(report.productID);
    if (!product) {
        throw new customError_1.default("Product not found", 404);
    }
    // Ensure the authenticated vendor owns the product
    if (product.vendorEmail !== vendorEmail) {
        throw new customError_1.default("You are not authorized to update this report", 403);
    }
    // Update report status
    report.status = status;
    yield report.save();
    return report;
});
exports.updateReportStatus = updateReportStatus;
const findReportByIdForVendor = (vendorEmail, reportId) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield Report_1.default.findById(reportId).populate("productID");
    if (!report) {
        throw new customError_1.default("Report not found", 404);
    }
    // Ensure the vendor owns the product related to the report
    const product = yield Product_1.default.findById(report.productID);
    if (!product) {
        throw new customError_1.default("Product not found", 404);
    }
    if (product.vendorEmail !== vendorEmail) {
        throw new customError_1.default("You are not authorized to access this report", 403);
    }
    return report;
});
exports.findReportByIdForVendor = findReportByIdForVendor;
