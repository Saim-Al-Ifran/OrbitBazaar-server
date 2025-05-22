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
router.get('/reports/vendor', authenticate_1.default, authorizeVendor_1.default, report_controller_1.getReportsByVendor);
router.get("/reports/vendor/:reportId", authenticate_1.default, authorizeVendor_1.default, report_controller_1.getReportByIdForVendor);
router.get('/reports/user/:reportId', authenticate_1.default, report_controller_1.getSingleReportByUser);
router.delete('/reports/user/:reportId', authenticate_1.default, report_controller_1.removeReportByUser);
router.put('/reports/user/:reportId', authenticate_1.default, report_controller_1.editReportByUser);
router.get('/reports/user', authenticate_1.default, report_controller_1.getReportsByUser);
router.patch('/reports/vendor/:reportId/status', authenticate_1.default, authorizeVendor_1.default, report_controller_1.editReportStatus);
exports.default = router;
