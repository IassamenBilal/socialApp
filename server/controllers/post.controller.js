import Post from "../models/post.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import formidable from "formidable";
import fs from "fs";

const listNewsFeed = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    let posts = await Post.find({ postedBy: { $in: req.profile.following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listByUser = async (req, res) => {
  try {
    let posts = await Post.find({ postedBy: req.profile._id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    return res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const create = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    try {
      let result = await post.save();
      res.json(result);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const postById = async (req, res, next, id) => {
  try {
    let post = await Post.findById(id).populate("postedBy", "_id name").exec();

    if (!post) {
      return res.status(400).json({
        error: "Post not found",
      });
    }
    req.post = post;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Could not retrieve use post",
    });
  }
};

const remove = async (req, res) => {
  try {
    let post = req.post;
    let removedPost = await post.remove();
    return res.json(removedPost);
  } catch (error) {
    return res.status(400).json({
      error: "Error deleteing post",
    });
  }
};

const like = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const unlike = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const comment = async (req, res) => {
  try {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: "Error comment",
    });
  }
};

const uncomment = async (req, res) => {
  const comment = req.body.comment;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: "Error uncomment",
    });
  }
};

const isPoster = async (req, res, next) => {
  console.log(req.post.postedBy._id, req.auth._id);
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

export default {
  listNewsFeed,
  listByUser,
  create,
  photo,
  postById,
  remove,
  isPoster,
  like,
  unlike,
  comment,
  uncomment,
};
