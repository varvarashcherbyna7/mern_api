// import express from "express";
// import mongoose from "mongoose";
// import multer from "multer";
// import { userController } from "./controllers/user_controller.ts";
// import { postController } from "./controllers/post_controller.ts";
// import { loginValidation, registerValidation } from "./validations/auth.ts";
// import { postCreateValidation } from "./validations/post.ts";
// import { handleValidationErrors } from "./utils/handleValidationErrors.ts";
// import { checkAuth } from "./utils/checkAuth.ts";
// mongoose.connect("mongodb+srv://admin:admin@cluster1.c7m7g.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster1").then(() => {
//   console.log("Database connected");
// }).catch((err) => {
//   console.log("Error in database connection => ", err);
// })
// const app = express();
// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });
// app.use(express.json());
// // find files if get request to /uploads
// app.use("/uploads", express.static("uploads"));
// // users
// app.post("/auth/login", loginValidation, handleValidationErrors, userController.login);
// app.post("/auth/register", registerValidation, handleValidationErrors, userController.register);
// app.get("/auth/me", checkAuth, userController.getMe);
// // files
// app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
//   if (!req.file) {
//     res.status(400).json({ message: "No file was uploaded" });
//     return;
//   };
//   res.json({
//     url: `/uploads/${req.file.originalname}`,
//   });
// });
// // posts
// app.get("/posts", postController.getAll);
// app.get("/posts/:id", postController.getOne);
// app.post("/posts", postCreateValidation, handleValidationErrors, checkAuth, postController.create);
// app.delete("/posts/:id", checkAuth, postController.deleteOne);
// app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, postController.update);
// app.listen(8000, (err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Server started on port 3000");
// });
console.log("Hello, TypeScript!");
