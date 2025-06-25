import { Model, Document,PopulateOptions } from "mongoose";
import { PaginationResult } from "../types/types";

const paginate = async <T extends Document>(
  model: Model<T>,
  filter: object,
  page: number,
  limit: number,
  sort: any = {},
  projection?: string,
  populate?: string  | PopulateOptions 
): Promise<PaginationResult<T>> => {
  const skip = (page - 1) * limit;

  let query = model.find<T>(filter);
  // Apply projection if provided
  if (projection) {
    query = query.select(projection);
  }
  // Apply population if provided
  if (populate) {
    if (typeof populate === "string") {
      query = query.populate([populate]);
    } else {
      query = query.populate(populate);
    }
  }

  const data:T[] = await query.skip(skip).limit(limit).sort(sort).exec();
  const totalRecords = await model.countDocuments(filter).exec();
  const totalPages = Math.ceil(totalRecords / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    data,
    totalRecords,
    totalPages,
    prevPage,
    nextPage,
    page,
  };
};

export default paginate;
