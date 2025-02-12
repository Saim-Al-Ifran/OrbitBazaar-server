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

export const addReport = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const userEmail = req.user?.email;
        const { productId, comment,reason } = req.body;  
        if (!userEmail) {
            throw new CustomError("User not found", 404);
        }
        const report = await createReport(productId, userEmail, comment, reason);

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
      const status = req.query.status as string; // Optional status filter
  
     const { data, totalRecords, totalPages, prevPage, nextPage } = await findReportsByVendor(vendorEmail, page, limit, status);

     if(data.length === 0){
       throw new  CustomError(`No ${status} reports found!`,404);
     }
  
     res.status(200).json({
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
    });
    }
) 
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
        if (!updatedReport) return res.status(400).json({ message: 'Cannot update resolved/rejected report' });
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
    
        const { data, totalRecords, totalPages, prevPage, nextPage } = await findAllReportsByUser(userEmail, page, limit);

        if(data.length === 0){
           throw new CustomError("No reports found!!",404);
        }
     
        res.status(200).json({
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
        });
    }
) 

export const getSingleReportByUser = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { reportId } = req.params;
      const userEmail = req.user?.email;
      if (!userEmail) {
        throw new CustomError("User not authenticated", 401);
      }
  
      const report = await findReportByUser(reportId, userEmail);
  
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
  
      if (!vendorEmail) {
        throw new CustomError("User not authenticated", 401);
      }
  
      const report = await findReportByIdForVendor(vendorEmail, reportId);
  
      res.status(200).json(report);
    }
  );
