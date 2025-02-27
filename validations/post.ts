import { body } from 'express-validator';


export const postCreateValidation = [
  body("title", "Title must be at least 3 characters").isLength({ min: 3 }).isString(),
  body("text", "Text must be at least 3 characters").isLength({ min: 10 }).isString(),
  body("tags").optional().isArray(),
  body('imageUrl', 'Invalid image url').optional().isURL(),
];
