"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const report_controller_1 = require("../../controllers/report/report.controller");
const router = express_1.default.Router();
router.post('/reports', authenticate_1.default, report_controller_1.addReport);
// Get reports by vendor (Authenticated vendor)
router.get('/reports/vendor/:vendorEmail');
// Get reports by product (Authenticated vendor)
router.get('/reports/product/:productId');
// Get a specific report by ID (Authenticated users)
router.get('/reports/:reportId');
// Delete a report (Authenticated users or vendors)
router.delete('/reports/:reportId');
// Update a report (Authenticated users, only if status is not resolved/rejected)
router.put('/reports/:reportId');
// Get all reports submitted by the authenticated user
router.get('/reports/user', authenticate_1.default, report_controller_1.getReportsByUser);
// Get report count for a specific product
router.get('/reports/product/:productId/count');
// Update report status (Authenticated vendors only)
router.put('/reports/:reportId/status');
exports.default = router;
