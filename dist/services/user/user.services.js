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
exports.createNewUser = exports.findUserByProperty = void 0;
const User_1 = __importDefault(require("../../models/User"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const findUserByProperty = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (key === '_id') {
            return yield User_1.default.findById(value).select('-password');
        }
        return yield User_1.default.findOne({ [key]: value });
    }
    catch (error) {
        throw new customError_1.default(`Error finding user by ${key}`, 500);
    }
});
exports.findUserByProperty = findUserByProperty;
const createNewUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new User_1.default(userData);
        return yield user.save();
    }
    catch (error) {
        throw new customError_1.default(error.message, 500);
    }
});
exports.createNewUser = createNewUser;
