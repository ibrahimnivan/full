import { NextFunction, Request, Response } from "express";

export default async (req: any, res: Response, next: NextFunction) => {
  const { role } = req

  if (role !== 'ORGANIZER') {
    return res.status(403).json({
      code: 403,
      message: "You aren't allowed to access this endpoint | authorization",
    });
  }

  next();
};
