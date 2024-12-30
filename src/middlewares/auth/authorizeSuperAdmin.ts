import { Request, Response, NextFunction } from 'express';
import CustomError from '../../utils/errors/customError';

const authorizeAdmin = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if  (req.user?.role !== 'super-admin') {
        return next(new CustomError('Only super-admin can access', 403));
    }
    next();
};

export default authorizeAdmin;