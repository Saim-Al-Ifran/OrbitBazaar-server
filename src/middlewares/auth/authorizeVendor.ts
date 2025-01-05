import { Request, Response, NextFunction } from 'express';
import CustomError from '../../utils/errors/customError';

const authorizeVendor = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
     
    if  (req.user?.role !== 'vendor') {
        return next(new CustomError('Only vendor can access', 403));
    }
    next();
};

export default authorizeVendor;