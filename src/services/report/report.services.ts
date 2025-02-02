import Report from "../../models/Report";
import { IReport } from "../../types/models/Report";
 

// Create a new report
export const createReport = async (data: Partial<IReport>) => {
  return await Report.create(data);
};

// Get all reports for a vendor's products
export const findReportsByVendor = async (vendorEmail: string) => {
  return await Report.find({ 'product.vendorEmail': vendorEmail }).populate('productID');
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
  return await Report.findOneAndDelete({ _id: reportId, userEmail });
};

// Update a report's comment or reason (only if status is not resolved or rejected)
export const updateReport = async (reportId: string, data: Partial<IReport>) => {
  return await Report.findOneAndUpdate(
    { _id: reportId, status: { $nin: ['resolve', 'reject'] } },
    data,
    { new: true }
  );
};

// Get all reports submitted by a specific user
export const findReportsByUser = async (userEmail: string) => {
  return await Report.find({ userEmail });
};

// Get the count of reports for a specific product
export const findReportCountByProduct = async (productId: string) => {
  return await Report.countDocuments({ productID: productId });
};

// Update the status of a report (only for vendors)
export const updateReportStatus = async (reportId: string, status: 'solved' | 'unsolved') => {
  return await Report.findByIdAndUpdate(reportId, { status }, { new: true });
};
