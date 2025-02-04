import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import {
    addReport,
    editReportByUser,
    editReportStatus,
    getReportByIdForVendor,
    getReportsByUser,
    getReportsByVendor,
    getSingleReportByUser,
    removeReportByUser
} from '../../controllers/report/report.controller';
import authorizeVendor from '../../middlewares/auth/authorizeVendor';
 

const router = express.Router();

router.post('/reports', authenticate, addReport);
// Get reports by vendor (Authenticated vendor)
router.get('/reports/vendor',authenticate,authorizeVendor,getReportsByVendor);

router.get("/reports/vendor/report/:reportId", authenticate,authorizeVendor, getReportByIdForVendor  );

// Get a specific report by ID (Authenticated users)
router.get('/reports/user/:reportId', authenticate, getSingleReportByUser );

// Delete a report (Authenticated users or vendors)
router.delete('/reports/user/:reportId', authenticate, removeReportByUser);

// Update a report (Authenticated users, only if status is not resolved/rejected)
router.put('/reports/user/:reportId',authenticate , editReportByUser);

// Get all reports submitted by the authenticated user
router.get('/reports/user', authenticate, getReportsByUser);

// Update report status (Authenticated vendors only)
router.patch('/reports/vendor/:reportId/status', authenticate , authorizeVendor , editReportStatus  );



export default router;
