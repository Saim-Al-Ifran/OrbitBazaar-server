import {IUser} from '../types/models/User';
declare global{
      namespace Express{
           interface Request{
               user?:IUser;
           }
      }
}