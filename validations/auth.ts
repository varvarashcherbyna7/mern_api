import { body } from 'express-validator';


export const registerValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  body("fullname", "Fullname must be at least 3 characters").isLength({ min: 3 }),
  body("avatarUrl", "Invalid avatar url").optional().isURL(),
];

export const loginValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
];
