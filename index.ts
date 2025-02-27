import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { userController } from "./controllers/user_controller.ts";
import { postController } from "./controllers/post_controller.ts";

import { loginValidation, registerValidation } from "./validations/auth.ts";
import { postCreateValidation } from "./validations/post.ts";
import { handleValidationErrors } from "./utils/handleValidationErrors.ts";
import { checkAuth } from "./utils/checkAuth.ts";
import { swaggerDocs } from "./utils/swagger.ts";


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
app.use(cors());
// find files if get request to /uploads
app.use("/uploads", express.static("uploads"));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged in successfully
*/

// users
app.post("/auth/login", loginValidation, handleValidationErrors, userController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User register
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *               fullname:
 *                 type: string
 *                 description: User fullname
 *               avatarUrl:
 *                 type: string
 *                 description: User avatar url
 *                 example: https://example.com/avatar
 *     tags: [User]
 *     responses:
 *       201:
 *         description: User registered successfully
*/
app.post("/auth/register", registerValidation, handleValidationErrors, userController.register);

/**
 * @swagger
 * /auth/me:
 *  get:
 *    summary: Get current user
 *    description: Returns the currently authenticated user.
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A single user object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: The user's ID
 *                email:
 *                  type: string
 *                  description: The user's email
 *                fullname:
 *                  type: string
 *                  description: The user's full name
 *                avatarUrl:
 *                  type: string
 *                  description: The user's avatar URL
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: The user's creation date
 */

app.get("/auth/me", checkAuth, userController.getMe);


/**
 * @swagger
 * /upload:
 *  post:
 *    summary: Upload a file
 *    tags: [Files]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: File uploaded successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                url:
 *                  type: string
 *                  description: The URL of the uploaded file
 *      400:
 *        description: No file was uploaded
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message
 */

// files
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {

  if (!req.file) {
    res.status(400).json({ message: "No file was uploaded" });
    return;
  };

  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// posts

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/post/PostSchema'
 */
app.get("/posts", postController.getAll);


app.get("/tags", postController.getLastTags);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/post/PostSchema'
 */
app.get("/posts/:id", postController.getOne);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *                 required: true
 *               text:
 *                 type: string
 *                 description: The text of the post
 *                 required: true
 *               tags:
 *                 type: array
 *                 description: The tags of the post
 *                 default: []
 *               imageUrl:
 *                 type: string
 *                 description: The image URL of the post
 *                 required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created post
 *                 title:
 *                   type: string
 *                   description: The title of the created post
 *                 text:
 *                   type: string
 *                   description: The text of the created post
 *                 tags:
 *                   type: array
 *                   description: The tags of the created post
 *                   default: []
 *                 imageUrl:
 *                   type: string
 *                   description: The image URL of the created post
 *                   required: false
 *                 viewsCount:
 *                   type: number
 *                   description: The views count of the created post
 *                   default: 0
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the user who created the post
 *                     email:
 *                       type: string
 *                       description: The email of the user who created the post
 *                     fullname:
 *                       type: string
 *                       description: The fullname of the user who created the post
 *                     avatarUrl:
 *                       type: string
 *                       description: The avatar URL of the user who created the post
 *                     createdAt:
 *                       type: string
 *                       description: The creation date of the user who created the post
 *                     updatedAt:
 *                       type: string
 *                       description: The update date of the user who created the post
 *                 updatedAt:
 *                   type: string
 *                   description: The ID of the user who created the post
 *                   required: true
 *                 createdAt:
 *                   type: string
 */
app.post("/posts", postCreateValidation, handleValidationErrors, checkAuth, postController.create);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The deleted post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the post was deleted successfully
 *                   required: true
 *                 message:
 *                   type: string
 *                   description: A message indicating whether the post was deleted successfully
 *                   required: true
 *                 deletedPost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the deleted post
 *                     title:
 *                       type: string
 *                       description: The title of the deleted post
 *                     text:
 *                       type: string
 *                       description: The text of the deleted post
 *                     tags:
 *                       type: array
 *                       description: The tags of the deleted post
 *                       default: []
 *                     imageUrl:
 *                       type: string
 *                       description: The image URL of the deleted post
 *                       required: false
 *                     viewsCount:
 *                       type: number
 *                       description: The views count of the deleted post
 *                       default: 0
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The ID of the user who created the deleted post
 *                         email:
 *                           type: string
 *                           description: The email of the user who created the deleted post
 *                         fullname:
 *                           type: string
 *                           description: The fullname of the user who created the deleted post
 *                         avatarUrl:
 *                           type: string
 *                           description: The avatar URL of the user who created the deleted post
 *                         createdAt:
 *                           type: string
 *                           description: The creation date of the user who created the deleted post
 *                         updatedAt:
 *                           type: string
 *                           description: The update date of the user who created the deleted post
 *                     updatedAt:
 *                       type: string
 *                       description: The ID of the user who created the deleted post
 *                       required: true
 *                     createdAt:
 *                       type: string
 *                       description: The creation date of the deleted post
 *                       required: true

 */

app.delete("/posts/:id", checkAuth, postController.deleteOne);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *                 required: true
 *               text:
 *                 type: string
 *                 description: The text of the post
 *                 required: true
 *               tags:
 *                 type: array
 *                 description: The tags of the post
 *                 default: []
 *               imageUrl:
 *                 type: string
 *                 description: The image URL of the post
 *                 required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated post
 *                 title:
 *                   type: string
 *                   description: The title of the updated post
 *                   required: true
 *                 text:
 *                   type: string
 *                   description: The text of the updated post
 *                   required: true
 *                 tags:
 *                   type: array
 *                   description: The tags of the updated post
 *                   default: []
 *                 imageUrl:
 *                   type: string
 *                   description: The image URL of the updated post
 *                   required: false
 *                 viewsCount:
 *                   type: number
 *                   description: The views count of the updated post
 *                   default: 0
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the user who created the updated post
 *                     email:
 *                       type: string
 *                       description: The email of the user who created the updated post
 *                     fullname:
 *                       type: string
 *                       description: The fullname of the user who created the updated post
 *                     avatarUrl:
 *                       type: string
 *                       description: The avatar URL of the user who created the updated post
 *                     createdAt:
 *                       type: string
 *                       description: The creation date of the user who created the updated post
 *                     updatedAt:
 *                       type: string
 *                       description: The update date of the user who created the updated post
 *                 updatedAt:
 *                   type: string
 *                   description: The ID of the user who created the updated post
 *                   required: true
 *                 createdAt:
 *                   type: string
 *                   description: The creation date of the updated post
 *                   required: true
 *
 *
 */
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, postController.update);


app.listen(8000, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server started on port 8000");
  swaggerDocs(app, 8000);
});
