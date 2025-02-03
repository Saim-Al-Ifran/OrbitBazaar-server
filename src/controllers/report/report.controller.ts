import { TryCatch } from "../../middlewares/TryCatch";
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utils/errors/customError";
import {
    createReport,
    deleteReport,
    findReportById,
    findReportCountByProduct,
    findReportsByProduct,
    findReportsByUser,
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
        if(!vendorEmail){
            throw new CustomError("user not found", 404);
        }
        const reports = await  findReportsByVendor(vendorEmail);
        res.status(200).json(reports);
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
export const removeReport = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { reportId } = req.params;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const deletedReport = await  deleteReport(reportId, userEmail);
        if (!deletedReport){
            throw new CustomError('Not authorized to delete this report',403);
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    }
) 
export const editReport  = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { reportId } = req.params;
        const updatedReport = await updateReport(reportId, req.body);
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
        const reports = await findReportsByUser(userEmail);
        res.status(200).json(reports);
    }
) 

export const getReportCountByProduct  = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { productId } = req.params;
        const count = await findReportCountByProduct(productId);
        res.status(200).json({ productId, count });
    }
) 
export const  editReportStatus  = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { reportId } = req.params;
        const { status } = req.body;
        if (!['solved', 'unsolved'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status value' });
        }
        const updatedReport = await updateReportStatus(reportId, status);
        res.status(200).json(updatedReport);
    }
) 
