import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { createNewUser, getAllUsers } from "../../services/user/user.services";
import CustomError from "../../utils/errors/customError";

export const findAllUsers = TryCatch(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const role = req.user?.role;
  
      if (role !== "super-admin" && role !== "admin") {
        throw new CustomError("Unauthorized role for fetching users", 403);
      }
  
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = req.query.sort || { createdAt: -1 };
      const search = req.query.search as string | undefined;
  
   
      const searchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { role: { $regex: search, $options: "i" } },
            ],
          }
        : {};
  
      const {data,totalRecords,totalPages,prevPage,nextPage}= await getAllUsers(role, page, limit, sort, searchQuery);
  
      res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data,
        pagination:{
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            page
        }

      });
    }
  );

export const createUser = TryCatch(
    async(req:Request,res:Response,_next:NextFunction)=>{

        let { name, email, password, role, phoneNumber } = req.body;
        const requesterRole = req.user?.role;
        role = requesterRole === 'admin' ? 'user' : role; 

        const userData = {
            name,
            email,
            password,
            role,
            phoneNumber,
          };
        const newUser = await createNewUser(userData);

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              phoneNumber: newUser.phoneNumber,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt,
            },
          });
    }
)