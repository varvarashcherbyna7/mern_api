import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { registerValidation, loginValidation, postCreateValidation } from "./validations/index.js";
import { userController, postController } from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";


mongoose.connect("mongodb+srv://admin:admin@cluster1.c7m7g.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster1").then(() => {
  console.log("Database connected");
}).catch((err) => {
  console.log("Error in database connection => ", err);
})


const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

// find files if get request to /uploads
app.use("/uploads", express.static("uploads"));

// users
app.post("/auth/login", loginValidation, handleValidationErrors, userController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, userController.register);
app.get("/auth/me", checkAuth, userController.getMe);

// files
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// posts
app.get("/posts", postController.getAll);
app.get("/posts/:id", postController.getOne);

app.post("/posts", postCreateValidation, handleValidationErrors, checkAuth, postController.create);
app.delete("/posts/:id", checkAuth, postController.deleteOne);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, postController.update);




app.listen(3000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server started on port 3000");
});
