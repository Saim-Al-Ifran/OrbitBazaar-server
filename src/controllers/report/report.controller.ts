import { TryCatch } from "../../middlewares/TryCatch";
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utils/errors/customError";
import {
    createReport,
    deleteReport,
    findAllReportsByUser,
    findReportById,
    findReportByIdForVendor,
    findReportByUser,
    findReportCountByProduct,
    findReportsByProduct,
    findReportsByVendor,
    updateReport,
    updateReportStatus
} from "../../services/report/report.services";
import { deleteCacheByPattern, getCache, setCache } from "../../utils/cache";

export const addReport = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        const { productId, comment,reason } = req.body;  
        if (!userEmail) {
            throw new CustomError("User not found", 404);
        }
        const report = await createReport(productId, userEmail, comment, reason);
        await deleteCacheByPattern("reports_user_*");
        res.status(201).json({
            message: "Report submitted successfully.",
            reportId: report.id
        });
    }
);

export const getReportsByVendor = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const vendorEmail = req.user?.email;
    if (!vendorEmail) {
      throw new CustomError("User not authenticated", 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    // Sorting logic
    const sortParam = (req.query.sort as string) || "createdAt:desc";
    const [field, order] = sortParam.split(":");
    const sort: Record<string, 1 | -1> = {
      [field]: order === "asc" ? 1 : -1,
    };

    const cacheKey = `reports_vendor_${vendorEmail}_page_${page}_limit_${limit}_status_${status || "all"}_sort_${field}_${order}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const {
      data,
      totalRecords,
      totalPages,
      prevPage,
      nextPage,
    } = await findReportsByVendor(vendorEmail, page, limit, status, sort);


    const reportResponse = {
      success: true,
      message: "Reports fetched successfully.",
      data,
      pagination: {
        totalRecords,
        totalPages,
        prevPage,
        nextPage,
        currentPage: page,
      },
    };

    await setCache(cacheKey, reportResponse, 60); // cache for 60 seconds
    res.status(200).json(reportResponse);
  }
);
export const getReportsByProduct = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { productId } = req.params;
        const reports = await findReportsByProduct(productId);
        res.status(200).json(reports);
    }
) 
export const getReportById = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { reportId } = req.params;
        const report = await findReportById(reportId);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json(report);
    }
) 
export const removeReportByUser = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { reportId } = req.params;
      const userEmail = req.user?.email;
      if (!userEmail) {
        throw new CustomError("User not authenticated", 401);
      }
      const result = await deleteReport(reportId, userEmail);
      await deleteCacheByPattern("reports_user_*");
      res.status(200).json(result);
    }
);

export const editReportByUser  = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { reportId } = req.params;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const updatedReport = await updateReport(reportId,userEmail ,req.body);

        if (!updatedReport){
          throw new CustomError("Cannot update resolved/rejected report", 400);
        }  
        await deleteCacheByPattern("reports_user_*");
        res.status(200).json(updatedReport);
    }
) 

export const getReportsByUser  = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const cacheKey = `reports_user_${userEmail}_page_${page}_limit_${limit}`;

        const cachedData = await getCache(cacheKey);
        if (cachedData) {
          return res.status(200).json(JSON.parse(cachedData));
        }
        const { data, totalRecords, totalPages, prevPage, nextPage } = await findAllReportsByUser(userEmail, page, limit);

        if(data.length === 0){
           throw new CustomError("No reports found!!",404);
        }
        const reportResponse = {
          success: true,
          message: "Reports fetched successfully.",
          data,
          pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page,
          },
        }
        await setCache(cacheKey,reportResponse, 60);
        res.status(200).json(reportResponse);
    }
) 

export const getSingleReportByUser = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { reportId } = req.params;
      const userEmail = req.user?.email;
      const cachedKey = `reports_user_${userEmail}_reportID_${reportId}`;
      const cachedReport = await getCache(cachedKey);
      if(cachedReport){
        return res.json(JSON.parse(cachedReport));
      }
      if (!userEmail) {
        throw new CustomError("User not authenticated", 401);
      }
  
      const report = await findReportByUser(reportId, userEmail);
      await setCache(cachedKey,{report},60);
      res.status(200).json({ report });
    }
  );

export const getReportCountByProduct  = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { productId } = req.params;
        const count = await findReportCountByProduct(productId);
        res.status(200).json({ productId, count });
    }
) 
export const editReportStatus = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const vendorEmail = req.user?.email;
      const { reportId } = req.params;
      const { status } = req.body;
      if (!vendorEmail) {
        throw new CustomError("User not authenticated", 401);
      }
      const updatedReport = await updateReportStatus(vendorEmail, reportId, status);
      await deleteCacheByPattern("reports_vendor_*");
      res.status(200).json({
        message: "Report status updated successfully",
        report: updatedReport,
      });
    }
  );

  export const getReportByIdForVendor = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const vendorEmail = req.user?.email;
      const { reportId } = req.params;
      const cachedKey = `reports_vendor_${vendorEmail}_reportID_${reportId}`;
      const cachedReport = await getCache(cachedKey);
      if(cachedReport){
        return res.json(JSON.parse(cachedReport));
      }
      if (!vendorEmail) {
        throw new CustomError("User not authenticated", 401);
      }
  
      const report = await findReportByIdForVendor(vendorEmail, reportId);
      await setCache(cachedKey,report,60);
      res.status(200).json(report);
    }
  );
