import { Request, Response, NextFunction } from 'express';
import { getDashboardStatsService, getVendorDashboardService } from '../../services/dashboard/dashboard.services';
import { TryCatch } from '../../middlewares/TryCatch';
 

export const getDashboardStats = TryCatch(
  async(_req: Request,res: Response,_next: NextFunction ) => {
  
      const stats = await getDashboardStatsService();
      res.status(200).json({
        success: true,
        message: 'Dashboard statistics fetched successfully',
        data: stats
      });
  
  });
export const getVendorDashboardStats = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const vendorEmail = req.user?.email as string;
    if (!vendorEmail) {
      return res.status(400).json({ message: 'Vendor email is required' });
    }
    const dashboardData = await getVendorDashboardService(vendorEmail);
    res.status(200).json(dashboardData);
 
});