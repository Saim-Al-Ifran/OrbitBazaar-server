"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const report_controller_1 = require("../../controllers/report/report.controller");
const authorizeVendor_1 = __importDefault(require("../../middlewares/auth/authorizeVendor"));
const router = express_1.default.Router();
router.post('/reports', authenticate_1.default, report_controller_1.addReport);
// Get reports by vendor (Authenticated vendor)
router.get('/reports/vendor', authenticate_1.default, authorizeVendor_1.default, report_controller_1.getReportsByVendor);
router.get("/reports/vendor/report/:reportId", authenticate_1.default, authorizeVendor_1.default, report_controller_1.getReportByIdForVendor);
// Get a specific report by ID (Authenticated users)
router.get('/reports/user/:reportId', authenticate_1.default, report_controller_1.getSingleReportByUser);
// Delete a report (Authenticated users or vendors)
router.delete('/reports/user/:reportId', authenticate_1.default, report_controller_1.removeReportByUser);
// Update a report (Authenticated users, only if status is not resolved/rejected)
router.put('/reports/user/:reportId', authenticate_1.default, report_controller_1.editReportByUser);
// Get all reports submitted by the authenticated user
router.get('/reports/user', authenticate_1.default, report_controller_1.getReportsByUser);
// Update report status (Authenticated vendors only)
router.patch('/reports/vendor/:reportId/status', authenticate_1.default, authorizeVendor_1.default, report_controller_1.editReportStatus);
exports.default = router;
