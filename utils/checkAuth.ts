// check if user is logged in can we send sicret data to client
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface AuthRequest extends Request {
  userId: string;
}

export const checkAuth = (req: Request | AuthRequest, res: Response, next: NextFunction): void | undefined => {
  // we must pars token from header and check it
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
      try {
        const decoded: string | JwtPayload = jwt.verify(token, "secret123");

        if (typeof decoded === 'object' && decoded !== null) {
          const authReq = { ...req, userId: decoded._id }; // Create a new request object with the userId property
          (req as AuthRequest).userId = decoded._id;
          next();
        } else {
          res.status(403).json({
            message: "User is not authorized"
          });
          return
        }
      } catch (e) {
        res.status(403).json({
          message: "User is not authorized"
        });
        return
      }


    } else {
      res.status(403).json({
        message: "User is not authorized"
      });
      return
    }

  } catch (e) {
    console.log(" Error in checkAuth => ", e);
  }
}
