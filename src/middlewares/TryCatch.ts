import { Request, Response, NextFunction } from 'express';

export const TryCatch = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logError(error, req);
      next(error);
    });
  };
};

// Utility for logging errors
const logError = (error: Error, req: Request) => {
  console.error('================= ERROR LOG =================');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Route:', `${req.method} ${req.originalUrl}`);
  console.error('Message:', error.message);
  if (error.stack) {
    console.error('Stack Trace:\n', error.stack);
  }
  console.error('=============================================');
};
