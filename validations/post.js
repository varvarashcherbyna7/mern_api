import { body } from 'express-validator';


export const postCreateValidation = [
  body("title", "Title must be at least 3 characters").isLength({ min: 3 }).isString(),
  body("text", "Text must be at least 3 characters").isLength({ min: 10 }).isString(),
  body("tags", "Tags must be at least 3 characters").optional().isString(),
  body('imageUrl', 'Invalid image url').optional().isURL(),
];
