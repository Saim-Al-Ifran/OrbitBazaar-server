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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryFromDb = exports.deleteCategoryImage = exports.uploadCategoryImage = exports.updateCategoryInDb = exports.createCategory = exports.getAllCategoriesForAdmin = exports.getAllCategories = exports.findCategoryById = void 0;
const Category_1 = __importDefault(require("../../models/Category"));
const delFileFromCloudinary_1 = require("../../utils/delFileFromCloudinary");
const fileUpload_1 = require("../../utils/fileUpload");
const paginate_1 = __importDefault(require("../../utils/paginate"));
// Find a category by its ID
const findCategoryById = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Category_1.default.findById(categoryId);
});
exports.findCategoryById = findCategoryById;
// Fetch all categories (public access)
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Category_1.default.find({});
});
exports.getAllCategories = getAllCategories;
// Fetch all categories for admin (admin access)
const getAllCategoriesForAdmin = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}) {
    return yield (0, paginate_1.default)(Category_1.default, query, page, limit);
});
exports.getAllCategoriesForAdmin = getAllCategoriesForAdmin;
// Create a new category (admin access)
const createCategory = (categoryData, file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, fileUpload_1.uploadFileToCloudinary)(file);
    const category = new Category_1.default(Object.assign(Object.assign({}, categoryData), { image: result.secure_url }));
    return yield category.save();
});
exports.createCategory = createCategory;
// Update a category in the database with the provided updates
const updateCategoryInDb = (categoryId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Category_1.default.findByIdAndUpdate(categoryId, updates, { new: true });
});
exports.updateCategoryInDb = updateCategoryInDb;
// Upload the category image to Cloudinary and return the URL
const uploadCategoryImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, fileUpload_1.uploadFileToCloudinary)(image);
    return result.secure_url;
});
exports.uploadCategoryImage = uploadCategoryImage;
// Delete the category image from Cloudinary
const deleteCategoryImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, delFileFromCloudinary_1.deleteFileFromCloudinary)(imageUrl);
});
exports.deleteCategoryImage = deleteCategoryImage;
// Delete a category from the database
const deleteCategoryFromDb = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Category_1.default.deleteOne({ _id: categoryId });
});
exports.deleteCategoryFromDb = deleteCategoryFromDb;
