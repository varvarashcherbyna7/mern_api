import PostModel from "../models/post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log("Posts find error => ", err);
    return res.status(500).json({
      message: "Posts find error"
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .then(updatedDoc => {
        console.log("Post updated => ", updatedDoc);
        return res.json(updatedDoc);
      })
      .catch(error => {
        console.log("Post find error => ", error);
        return res.status(500).json({
          message: "Post find error"
        });
      });

  } catch (err) {
    console.log("Post find error ==> ", err);
    return res.status(500).json({
      message: "Post find error"
    });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete(
      { _id: postId },
    )
      .then((deletedDoc) => {
        console.log("Post deleted => ", deletedDoc);
        return res.json({
          success: true
        });
      })
      .catch(error => {
        console.log("Post find error => ", error);
        return res.status(500).json({
          message: "Delete post find error"
        });
      });

  } catch (err) {
    console.log("Post find error ==> ", err);
    return res.status(500).json({
      message: "Post find error"
    });
  }
};

export const create = async (req, res) => {
  try {

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId
    });

    // create new user in db
    const post = await doc.save();
    res.json(post);

  } catch (err) {
    console.log("Post create error => ", err);
    return res.status(500).json({
      message: "Post create error"
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId
      }
    )
      .then((updatedDoc) => {
        console.log("Post updated => ", updatedDoc);
        return res.json({
          success: true
        });
      })
      .catch(error => {
        console.log("Post update error => ", error);
        return res.status(500).json({
          message: "Post update error"
        });
      });

  } catch (err) {
    console.log("Post update error ==> ", err);
    return res.status(500).json({
      message: "Post update error"
    });
  }
}
