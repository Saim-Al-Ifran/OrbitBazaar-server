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
router.get('/reports/vendor',authenticate,authorizeVendor,getReportsByVendor);
router.get("/reports/vendor/:reportId", authenticate,authorizeVendor, getReportByIdForVendor  );
router.get('/reports/user/:reportId', authenticate, getSingleReportByUser );
router.delete('/reports/user/:reportId', authenticate, removeReportByUser);
router.put('/reports/user/:reportId',authenticate , editReportByUser);
router.get('/reports/user', authenticate, getReportsByUser);
router.patch('/reports/vendor/:reportId/status', authenticate , authorizeVendor , editReportStatus  );



export default router;
