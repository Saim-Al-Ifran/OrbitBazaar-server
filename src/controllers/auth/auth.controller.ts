import {  Request, Response, NextFunction} from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { changePasswordService, loginAdminService, loginUserService, refreshTokenService, registerUserService, registerVendorService,} from "../../services/auth/auth.services";
import CustomError from "../../utils/errors/customError";
import {firebaseAdmin} from '../../firebase/firebase';
import { createNewUser, findUserByProperty } from "../../services/user/user.services";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/token";

export const registerUser = TryCatch(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userData = req.body;
    
    const newUser = await registerUserService(userData);
    res.cookie('accessToken', newUser.accessToken, { httpOnly: true,secure:true,maxAge: 3600000 });
    res.cookie('refreshToken',newUser.refreshToken, { httpOnly: true,secure:true ,maxAge: 7 * 24 * 60 * 60 * 1000 });
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

export const registerVendor = TryCatch(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const vendorData = req.body;

    const newVendor = await registerVendorService(vendorData);

    res.cookie('accessToken', newVendor.accessToken, { httpOnly: true,secure:true, maxAge: 3600000 });
    res.cookie('refreshToken', newVendor.refreshToken, { httpOnly: true,secure:true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
        success: true,
        message: 'Vendor registered successfully',
        data: {
            accessToken: newVendor.accessToken,
            refreshToken: newVendor.refreshToken,
            user: newVendor.payload,
        },
    });
});


export const userLogin = TryCatch(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const loginData = req.body;
    const {payload,accessToken, refreshToken} = await loginUserService(loginData);
    res.cookie('accessToken', accessToken, { httpOnly: true,secure:true ,maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true,secure:true ,maxAge: 7 * 24 * 60 * 60 * 1000 });
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
    res.cookie('accessToken', accessToken, { httpOnly: true, secure:true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:true, maxAge: 7 * 24 * 60 * 60 * 1000 });
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
    const { refreshToken: refreshTokenFromCookie} = req.cookies;
    console.log("Rrefresh token from cookie", refreshTokenFromCookie);
    if (!refreshTokenFromCookie) {
      throw new CustomError('Refresh token not provided', 403);
    }

    const  {newPayload,accessToken, refreshToken: newRefreshToken } = await refreshTokenService(refreshTokenFromCookie);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure:true , maxAge: 3600000 });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure:true , maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data:{
            accessToken:  accessToken,
            refreshToken:  newRefreshToken,
            user:  newPayload
        }
    });
});


export const firebaseLoginController = TryCatch(async (req: Request, res: Response, _next: NextFunction) => {
 
      const { idToken } = req.body;
      if (!idToken) throw new CustomError('No ID token provided', 400);
  
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { uid, email, name ,phoneNumber, picture} = decodedToken;
    
      if (!email) {
        throw new CustomError('Email is missing', 400);
      }
      let user = await findUserByProperty('email', email);
      if (!user) {
        user = await createNewUser({ 
            name: name|| 'Anonymous', 
            phoneNumber:phoneNumber || 'N/A',
            email,
            firebaseUID: uid,
            image: picture || 'N/A', 
         });
      }
  
      const payload = {
        id: user._id,
        email: user.email,
        username: user.name,
        role: user.role,
      };
  
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
  
      user.refreshTokens.push({ token: refreshToken });
      await user.save();
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true , maxAge: 3600000 });
      res.cookie('refreshToken', refreshToken , { httpOnly: true, secure:true , maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data:{
            accessToken:  accessToken,
            refreshToken:  refreshToken,
            user:  payload
        }
    });
 
  });

  export const resetPassword = TryCatch(
    async (req: Request, res: Response) => {
        const email = req.user?.email;
        const {oldPassword, newPassword } = req.body;
        console.log(email);
        
        if(!email || !oldPassword || !newPassword) {
          throw new CustomError('Email, old password, and new password are required.', 400);
        }
    
        await changePasswordService(email, oldPassword, newPassword);
        res.status(200).json({ success:true,message: 'Password changed successfully.' });
 
  });


export const logout = TryCatch(
 async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    res.clearCookie("accessToken", { httpOnly: true,secure:true  });
    res.clearCookie("refreshToken", { httpOnly: true,secure:true   });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});