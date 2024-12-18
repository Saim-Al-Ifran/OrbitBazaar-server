"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = void 0;
const TryCatch = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            logError(error, req);
            next(error);
        });
    };
};
exports.TryCatch = TryCatch;
// Utility for logging errors
const logError = (error, req) => {
    console.error('================= ERROR LOG =================');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Route:', `${req.method} ${req.originalUrl}`);
    console.error('Message:', error.message);
    if (error.stack) {
        console.error('Stack Trace:\n', error.stack);
    }
    console.error('=============================================');
};
