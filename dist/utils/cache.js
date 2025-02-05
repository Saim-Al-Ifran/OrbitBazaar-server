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
exports.delCache = exports.setCache = exports.getCache = void 0;
const redis_1 = __importDefault(require("../config/redis"));
// Function to get a cached value
const getCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield redis_1.default.get(key);
    }
    catch (err) {
        console.error(`Error getting cache for key: ${key}`, err);
        return null;
    }
});
exports.getCache = getCache;
// Function to set a cached value with an expiration
const setCache = (key, value, ttl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_1.default.setEx(key, ttl, JSON.stringify(value));
    }
    catch (err) {
        console.error(`Error setting cache for key: ${key}`, err);
    }
});
exports.setCache = setCache;
// Function to delete a cached key
const delCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_1.default.del(key);
    }
    catch (err) {
        console.error(`Error deleting cache for key: ${key}`, err);
    }
});
exports.delCache = delCache;
