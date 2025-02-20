import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
export const register = async (req, res) => {
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

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token })

  } catch (err) {
    console.log("User creation error => ", err);
    return res.status(500).json({
      message: "Registration error"
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      console.log("User not found");

      return res.status(400).json({
        message: "Login or password is incorrect"
      });
    };

    const isValidPass = bcrypt.compareSync(req.body.password, user.passwordHash);

    if (!isValidPass) {
      console.log("Invalid password");

      return res.status(400).json({
        message: "Login or password is incorrect"
      });
    };

    const token = jwt.sign({
      _id: user._id,
    }, "secret123", { expiresIn: "30d" });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });

  } catch (err) {
    console.log("Login error => ", err);
    return res.status(500).json({
      message: "Login error"
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    };

    const { passwordHash, ...userData } = user._doc

    res.json(userData)

  } catch (err) {
    console.log("User find error => ", err);
    return res.status(500).json({
      message: "User find error"
    });
  }
}
