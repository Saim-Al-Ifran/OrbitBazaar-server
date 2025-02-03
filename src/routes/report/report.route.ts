import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import { addReport, getReportsByUser } from '../../controllers/report/report.controller';
 

const router = express.Router();

router.post('/reports', authenticate, addReport);
// Get reports by vendor (Authenticated vendor)
router.get('/reports/vendor/:vendorEmail',);

// Get reports by product (Authenticated vendor)
router.get('/reports/product/:productId', );

// Get a specific report by ID (Authenticated users)
router.get('/reports/:reportId', );

// Delete a report (Authenticated users or vendors)
router.delete('/reports/:reportId',  );

// Update a report (Authenticated users, only if status is not resolved/rejected)
router.put('/reports/:reportId', );

// Get all reports submitted by the authenticated user
router.get('/reports/user', authenticate, getReportsByUser);

// Get report count for a specific product
router.get('/reports/product/:productId/count',  );

// Update report status (Authenticated vendors only)
router.put('/reports/:reportId/status',  );



export default router;
