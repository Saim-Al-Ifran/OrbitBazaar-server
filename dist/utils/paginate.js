"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const paginate = (model_1, filter_1, page_1, limit_1, ...args_1) => __awaiter(void 0, [model_1, filter_1, page_1, limit_1, ...args_1], void 0, function* (model, filter, page, limit, sort = {}, projection, populate) {
    const skip = (page - 1) * limit;
    let query = model.find(filter);
    // Apply projection if provided
    if (projection) {
        query = query.select(projection);
    }
    // Apply population if provided
    if (populate) {
        query = query.populate(populate);
    }
    const data = yield query.skip(skip).limit(limit).sort(sort).exec();
    const totalRecords = yield model.countDocuments(filter).exec();
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
});
exports.default = paginate;
