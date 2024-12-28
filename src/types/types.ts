import {IUser} from '../types/models/User';

declare global{
      namespace Express{
           interface Request{
               user?:IUser;
           }
      }
}
 
export interface PaginationResult<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
  page: number;
}

export interface CloudinaryDeleteResponse {
  result: string;
}