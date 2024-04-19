import { IUser } from './types/interfaces'; 
import "express";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
        user?: User;
    }
  }
}