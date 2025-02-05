import Order from "../../models/Order";
import Product from "../../models/Product";
import Report from "../../models/Report";
import { IReport } from "../../types/models/Report";
import { PaginationResult } from "../../types/types";
import CustomError from "../../utils/errors/customError";
import paginate from "../../utils/paginate";
 

// Create a new report
export const createReport = async (productID: string, userEmail: string, comment:string,reason:string) => {
 
  
  const hasPurchased = await Order.findOne({
     userEmail,
    'items.productID':productID
   });
 
   
  if (!hasPurchased) {
    throw new CustomError('You can only report products you have purchased.', 403);
  }
  console.log({userEmail,productID,});
  
  return await Report.create({userEmail,productID,comment,reason});
};

// Get all reports for a vendor's products
export const findReportsByVendor = async (
  vendorEmail: string,
  page: number,
  limit: number,
  status?: string
):Promise<PaginationResult<IReport>> => {
 
  // Get all products owned by the vendor
  const products = await Product.find({ vendorEmail }).select("_id");

  if (!products.length) {
    throw new CustomError("No products found for this vendor", 404);
  }

  const productIds = products.map((p) => p._id);

  // Build filter query
  const filter: any = { productID: { $in: productIds } };
  if (status) {
    filter.status = status;
  }

  return await paginate(Report, filter, page, limit, { createdAt: -1 }, "", "productID");
};



// Get all reports for a specific product
export const findReportsByProduct = async (productId: string) => {
  return await Report.find({ productID: productId });
};



// Get a report by its ID
export const findReportById = async (reportId: string) => {
  return await Report.findById(reportId);
};

// Delete a report (only the user who submitted it or the vendor can delete)
export const deleteReport = async (reportId: string, userEmail: string) => {
  const report = await Report.findOne({ _id: reportId, userEmail });
  if (!report) {
    throw new CustomError("Report not found or you don't have permission to delete it.", 403);
  }
  await Report.findByIdAndDelete(reportId);
  return { message: "Report deleted successfully." };
};

// Update a report's comment or reason (only if status is not resolved or rejected)
export const updateReport = async (reportId: string, userEmail: string, data: Partial<IReport>) => {
  const report = await Report.findOne({ _id: reportId, userEmail });
  if (!report) {
    throw new CustomError("Report not found or you don't have permission to update it.", 403);
  }
  if (report.status === "resolve" || report.status === "reject") {
    throw new CustomError("Cannot update a resolved or rejected report.", 400);
  }
  return await Report.findByIdAndUpdate(reportId, data, { new: true });
};

// Get all reports submitted by a specific user
export const findAllReportsByUser = async (
  userEmail: string,
  page: number,
  limit: number
):Promise<PaginationResult<IReport>> => {
  return await paginate(Report, { userEmail }, page, limit, { createdAt: -1 }, "", "productID");
};

// Get a specific  reports submitted by a  user
export const findReportByUser = async (reportId: string, userEmail: string) => {
  const report = await Report.findById(reportId);
  
  if (!report) {
    throw new CustomError("Report not found", 404);
  }

  if (report.userEmail !== userEmail) {
    throw new CustomError("You are not authorized to view this report", 403);
  }

  return report;
};

// Get the count of reports for a specific product
export const findReportCountByProduct = async (productId: string) => {
  return await Report.countDocuments({ productID: productId });
};

// Update the status of a report (only for vendors)
export const updateReportStatus = async (vendorEmail: string, reportId: string, status:  "pending" | "resolve" | "reject") => {
    // Find the report
    const report = await Report.findById(reportId);
    if (!report) {
      throw new CustomError("Report not found", 404);
    }
  
    // Find the product associated with this report
    const product = await Product.findById(report.productID);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
  
    // Ensure the authenticated vendor owns the product
    if (product.vendorEmail !== vendorEmail) {
      throw new CustomError("You are not authorized to update this report", 403);
    }
  
    // Update report status
    report.status = status;
    await report.save();
  
    return report;
};
export const findReportByIdForVendor = async (vendorEmail: string, reportId: string) => {
  const report = await Report.findById(reportId).populate("productID");

  if (!report) {
    throw new CustomError("Report not found", 404);
  }

  // Ensure the vendor owns the product related to the report
  const product = await Product.findById(report.productID);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  if (product.vendorEmail !== vendorEmail) {
    throw new CustomError("You are not authorized to access this report", 403);
  }

  return report;
};