import { Request, Response, NextFunction } from 'express';
import { getDashboardStatsService } from '../../services/dashboard/dashboard.services';
import { TryCatch } from '../../middlewares/TryCatch';
 

export const getDashboardStatsController = TryCatch(
  async(_req: Request,res: Response,_next: NextFunction ) => {
  
      const stats = await getDashboardStatsService();
      res.status(200).json({
        success: true,
        message: 'Dashboard statistics fetched successfully',
        data: stats
      });
  
  });
