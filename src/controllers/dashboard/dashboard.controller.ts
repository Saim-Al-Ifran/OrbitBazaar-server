import { Request, Response, NextFunction } from 'express';
import { getDashboardStatsService } from '../../services/dashboard/dashboard.services';
 

export const getDashboardStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
