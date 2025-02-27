import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array(),
      message: "Validation error"
    });
    return;
  };
  next();
}
