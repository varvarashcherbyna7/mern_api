import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.ts";
import { UserRequest } from "../types/user";
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const password = req.body.password;
    // generate salt (algorithm) for hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullname: req.body.fullname,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl
    });

    // create new user in db
    const user = await doc.save();

    const token = jwt.sign({
      _id: user._id,
    }, "secret123", { expiresIn: "30d" });

    const userData = user.toObject();
    const { passwordHash, ...rest } = userData

    res.json({ ...rest, token })
    next();
  } catch (err) {
    console.log("User creation error => ", err);
    res.status(500).json({
      message: "Registration error"
    });
    return;
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      console.log("User not found");

      res.status(400).json({
        message: "Login or password is incorrect"
      });
      return;
    };

    const isValidPass = bcrypt.compareSync(req.body.password, user.passwordHash);

    if (!isValidPass) {
      console.log("Invalid password");

      res.status(400).json({
        message: "Login or password is incorrect"
      });
      return;
    };

    const token = jwt.sign({
      _id: user._id,
    }, "secret123", { expiresIn: "30d" });

    const userData = user.toObject();
    const { passwordHash, ...rest } = userData;

    res.json({ ...rest, token });
    next();

  } catch (err) {
    console.log("Login error => ", err);
    res.status(500).json({
      message: "Login error"
    });
    return;
  }
};


const getMe = async (req: Request | UserRequest, res: Response) => {

  try {
    const user = await UserModel.findById((req as UserRequest).userId);

    if (!user) {
      res.status(404).json({
        message: "User not found"
      });
      return;
    };

    const userData = user.toObject();
    console.log("[getMe] userData => ", userData);

    const { passwordHash, ...rest } = userData;

    res.json(rest)
  } catch (err) {
    console.log("User find error => ", err);
    res.status(500).json({
      message: "User find error"
    });
    return;
  }
}

export const userController = { register, login, getMe };
