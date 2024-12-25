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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const secret_1 = require("../../secret");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const authenticate = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        let token = req.cookies.accessToken || (authHeader && authHeader.split(' ')[1]);
        console.log(token);
        if (!token) {
            return next(new customError_1.default('Unauthorized', 403));
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret_1.secretKey);
        const user = yield User_1.default.findById({ _id: decoded.id });
        if (!user) {
            return next(new customError_1.default('Unauthorized', 401));
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new customError_1.default('Token expired', 401));
        }
        if (err.name === 'JsonWebTokenError' || err.name === 'SyntaxError') {
            return next(new customError_1.default('Invalid token', 401));
        }
        next(new customError_1.default('Authentication server problem', 500));
    }
});
exports.default = authenticate;
