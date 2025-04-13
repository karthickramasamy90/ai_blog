import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: { userId: number }; // Define the user property
}
