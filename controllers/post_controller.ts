import PostModel from "../models/post.js";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../types/user";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
    next();
  } catch (err) {
    console.log("Posts find error => ", err);
    res.status(500).json({
      message: "Posts find error"
    });
    return
  }
};

const getLastTags = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.map(post => post.tags).flat().slice(0, 5);
    res.json(tags);
    next();
  } catch (err) {
    console.log("Posts find error => ", err);
    res.status(500).json({
      message: "Posts find error"
    });
    return
  };
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .then(updatedDoc => {
        console.log("Post updated => ", updatedDoc);
        res.json(updatedDoc);
        return
      })
      .catch(error => {
        console.log("Post find error => ", error);
        res.status(500).json({
          message: "Post find error"
        });
        return
      });


  } catch (err) {
    console.log("Post find error ==> ", err);
    res.status(500).json({
      message: "Post find error"
    });
    return
  }
};

const deleteOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete(
      { _id: postId },
    )
      .then((deletedDoc) => {
        console.log("Post deleted => ", deletedDoc);
        res.json({
          success: true
        });
        return
      })
      .catch(error => {
        console.log("Post find error => ", error);
        res.status(500).json({
          message: "Delete post find error"
        });
        return

      });

  } catch (err) {
    console.log("Post find error ==> ", err);
    res.status(500).json({
      message: "Post find error"
    });
    return
  }
};

const create = async (req: Request | UserRequest, res: Response) => {
  try {

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: (req as UserRequest).userId
    });

    // create new user in db
    const post = await doc.save();
    res.json(post);

  } catch (err) {
    console.log("Post create error => ", err);
    res.status(500).json({
      message: "Post create error"
    });
    return
  }
};

const update = async (req: Request | UserRequest, res: Response) => {
  try {
    const postId = (req as Request).params.id;
    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: (req as UserRequest).userId
      }
    )
      .then((updatedDoc) => {
        console.log("Post updated => ", updatedDoc);
        res.json({
          success: true
        });
        return
      })
      .catch(error => {
        console.log("Post update error => ", error);
        res.status(500).json({
          message: "Post update error"
        });
        return
      });

  } catch (err) {
    console.log("Post update error ==> ", err);
    res.status(500).json({
      message: "Post update error"
    });
    return
  }
}


export const postController = {
  getAll,
  getLastTags,
  getOne,
  deleteOne,
  create,
  update
};
