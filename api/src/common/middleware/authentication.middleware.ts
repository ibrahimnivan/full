import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwt.helper";

export default async (req: any, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;
  
  if (!authToken) {
    return res.status(403).json({
      code: 403,
      message: "You aren't allowed to access this endpoint | authToken",
    });
  }


  const userToken = authToken.split(" ")[1];
  if (!userToken) {
    return res.status(403).json({
      code: 403,
      message: "You aren't allowed to access this endpoint | userToken",
    });
  }

  const verifyTokenResult = verifyToken(userToken);
  if (!verifyTokenResult.isValid) {
    return res.status(403).json({
      code: 403,
      message: "Invalid Token",
    });
  }

  console.log('tokenresult',verifyTokenResult)

  // req: any
  // inject data to req object
  const { id, username, email, role } = verifyTokenResult.data;
  req.userId = id;
  req.username = username;
  req.userEmail = email;
  req.role = role 

  next();
};
