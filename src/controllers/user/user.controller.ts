import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { 
  approveVendor,
  changePassword,
  createNewUser,
  deleteUserService,
  findUserByProperty,
  getAllUsers,
  toggleUserRole,
  toggleUserStatus,
  updateUserProfile,
  uploadUserProfileImage
} from "../../services/user/user.services";
import CustomError from "../../utils/errors/customError";
import { deleteCache, deleteCacheByPattern, getCache, setCache } from "../../utils/cache";
import { getUniquePurchasedProducts } from "../../services/order/order.services";

export const findAllUsers = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const role = req.user?.role;

      if (role !== "super-admin" && role !== "admin") {
        throw new CustomError("Unauthorized role for fetching users", 403);
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Updated Sort Parsing
      const sortParam = (req.query.sort as string) || "createdAt:desc";
      const [sortField, sortOrder] = sortParam.split(":");
      const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };
      const search = req.query.search as string | undefined;
      
      // ✨ New Filters
      const filterRole = req.query.role as string | undefined;
      const vendorRequestStatus = req.query.vendorRequestStatus as string | undefined;
      const status = req.query.status as string | undefined;

      if(role === 'admin' && filterRole === 'admin'){
        throw new CustomError("Unauthorized role for fetching users", 403);
      }

      
      // Build search query
      const searchQuery: any = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { role: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      searchQuery.isDeleted = false;
      // 🧠 Add filter conditions
      if (filterRole) {
        searchQuery.role = filterRole;
      }
      if (vendorRequestStatus) {
        searchQuery.vendorRequestStatus = vendorRequestStatus;
      }
      if (status) {
        searchQuery.status = status;
      }
      
      // Cache key (also updated with new filters)
      const cachedKey = `users:role:${role}:filterRole:${filterRole || "none"}:vendorStatus:${vendorRequestStatus || "none"}:userStatus:${status || "none"}:page:${page}:limit:${limit}:sort:${sortField}_${sortOrder}:search:${search || "none"}`;
      
      // Check cache
      const cachedData = await getCache(cachedKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      // Fetch from DB
      const { data, totalRecords, totalPages, prevPage, nextPage } = await getAllUsers(role, page, limit, sort, searchQuery);
      if(data.length === 0){
        throw new CustomError("No users found", 404);
      }
      
      // Return
      const userResponse = {
        success: true,
        message: "Users fetched successfully.",
        data,
        pagination: {
          totalRecords,
          totalPages,
          prevPage,
          nextPage,
          currentPage: page,
        }
      };
      
      await setCache(cachedKey, userResponse, 120);
      
      res.status(200).json(userResponse);
      
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
        await deleteCacheByPattern("users:role*");
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

export const updateUserStatus = TryCatch(
    async(req:Request,res: Response,_next: NextFunction)=>{

        const requesterRole = req.user?.role;
        if (requesterRole !== "super-admin" && requesterRole !== "admin") {
            throw new CustomError("Unauthorized role for fetching users", 403);
          }
      
        const { id } = req.params;
        const { status } = req.body;
        console.log(req.body)
        const updatedUser = await toggleUserStatus(id, status,requesterRole);
        await deleteCacheByPattern("users:role*");
        res.status(200).json({
            success: true,
            message: `User status updated to ${status} successfully.`,
            data: {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              status: updatedUser.status,
              updatedAt: updatedUser.updatedAt,
            },
        });
    }
)
export const updateUserRole = TryCatch(
    async(req:Request,res: Response,_next: NextFunction)=>{

        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await toggleUserRole(id, role);
        await deleteCacheByPattern("users:role*");
        res.status(200).json({
            success: true,
            message: `User status updated to ${role} successfully.`,
            data: {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              status: updatedUser.status,
              updatedAt: updatedUser.updatedAt,
            },
        });
    }
)

export const updateVendorRequestStatus = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
        const { userId } = req.params;
        const { status } = req.body;
        console.log(req.body)
        const updatedUser = await approveVendor(userId, status);
        await deleteCacheByPattern("users:role*");
        res.status(200).json({
          success: true,
          message: `Vendor status updated successfully to '${status}'.`,
          data: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            vendorRequestStatus: updatedUser.vendorRequestStatus,
            updatedAt: updatedUser.updatedAt,
          },
        });
  }
)
export const getUserProfile = TryCatch(
  async(req:Request,res:Response,_next:NextFunction) =>{
         const email=req.user?.email;
         if (!email) {
          throw new CustomError('User ID is missing', 400);
         }
         const cachedKey = `user_profile:${email}`;
         const cachedData = await getCache(cachedKey);
         if (cachedData) {
          return res.json(JSON.parse(cachedData));
         }
         const user = await findUserByProperty('email',email);
         const userProfileResponse = {
            success: true,
            message: 'User profile retrieved successfully.',
            data: user,
         };
         await setCache(cachedKey,userProfileResponse,120);
         res.status(200).json(userProfileResponse);
  }
)

export const updateUserProfileImage = TryCatch(
   async(req:Request,res:Response,_next:NextFunction)=>{

        const email = req.user?.email;
        if (!email) {
          throw new CustomError('Unauthorized request.', 401);
        }
    
        if (!req.file) {
          throw new CustomError('Profile image is required.', 400);
        }
        const updatedUser = await uploadUserProfileImage(email, req.file);
        await deleteCache(`user_profile:${email}`);
        res.status(200).json({
          success: true,
          message: 'Profile image uploaded successfully.',
          data: {
            image: updatedUser.image
          },
        });
        
   }
)

export const updateUserProfileHandler = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
    const email = req.user?.email;
    if (!email) {
      throw new CustomError('Email is required', 400);
    }
    const updates = req.body;
    const updatedUser = await updateUserProfile(email, updates);
    await deleteCache(`user_profile:${email}`);
    res.status(200).json({
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image:updatedUser.image,
        role:updatedUser.role,
      },
    });
  }
)

export const changePasswordHandler = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
    const email = req.user?.email;  
    const { currentPassword ,newPassword } = req.body;

    if (!newPassword) {
      throw new CustomError('New password is required', 400);
    }
    if (!email) {
      throw new CustomError('Email is required', 400);
    }

    const updatedUser = await changePassword(email, currentPassword ,newPassword);

    res.status(200).json({
      message: 'Password updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  }
)

export const deleteUser = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
    const requesterRole = req.user?.role; // Assume this comes from authentication middleware
    const { id } = req.params;
    if(!requesterRole){
      throw new CustomError('Unauthorized', 401);
    }
    await deleteUserService(requesterRole, id);
    await deleteCacheByPattern("users:role*");
    return res.status(200).json({success:true,message: "User deleted successfully, Wishlist & Cart cleared" });
  }
)



export const getUserPurchasedProducts = TryCatch(
  async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new CustomError('User email is required', 400);
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.sort as string || "createdAt:desc";

    // Sorting logic
    const sortParam = (sort as string) || "createdAt:desc";
    const [field, order] = sortParam.split(":");
    const sortOption: Record<string, 1 | -1> = {
      [field]: order === "asc" ? 1 : -1,
    };

    const { data, totalRecords, totalPages, prevPage, nextPage } = await getUniquePurchasedProducts(userEmail, page, limit, sortOption);
    const purchasedProductResponse = { 
      success: true,
      message: "Reviews fetched successfully.",
      data,
      pagination: {
        totalRecords,
        totalPages,
        prevPage,
        nextPage,
        currentPage: page,
      },
    };
    res.status(200).json(purchasedProductResponse);
  }
);
 