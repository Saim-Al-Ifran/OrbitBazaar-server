import {  Request, Response, NextFunction} from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { loginAdminService, loginUserService, refreshTokenService, registerUserService } from "../../services/auth/auth.services";
import CustomError from "../../utils/errors/customError";

export const registerUser = TryCatch(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userData = req.body;
    
    const newUser = await registerUserService(userData);
    res.cookie('accessToken', newUser.accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken',newUser.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data:{
            accessToken: newUser.accessToken,
            refreshToken: newUser.refreshToken,
            user:newUser.payload
        }
    });
});

export const userLogin = TryCatch(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const loginData = req.body;
    const {payload,accessToken, refreshToken} = await loginUserService(loginData);
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data:{
            accessToken: accessToken,
            refreshToken:  refreshToken,
            user: payload
        }
    });
});

export const adminLogin = TryCatch(async (req: Request, res: Response, _next: NextFunction):Promise<void> => {
    const loginData = req.body;
    const {payload,accessToken, refreshToken} = await loginAdminService(loginData);
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data:{
            accessToken:  accessToken,
            refreshToken: refreshToken,
            user: payload
        }
    });
});

export const refreshToken = TryCatch(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken) {
      throw new CustomError('Refresh token not provided', 403);
    }

    const tokens = await refreshTokenService(refreshToken);

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json(tokens);
});


