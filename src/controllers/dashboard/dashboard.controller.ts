import { Request, Response, NextFunction } from 'express';
import { getDashboardStatsService, getUserDashboardService, getVendorDashboardService } from '../../services/dashboard/dashboard.services';
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

export const getUserDashboardStats = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userEmail = req.user?.email as string;
    const userId = req.user?._id as string;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }
    const dashboardData = await getUserDashboardService(userId,userEmail);
    res.status(200).json(dashboardData);
  }
);