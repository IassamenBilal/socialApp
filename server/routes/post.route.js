import express from "express";
const router = express.Router();

import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import postCtrl from "../controllers/post.controller.js";

router.post("/api/posts/new/:userId", authCtrl.requireSignin, postCtrl.create);

router.get("/api/posts/photo/:postId", postCtrl.photo);
router.get(
  "/api/posts/by/:userId",
  authCtrl.requireSignin,
  postCtrl.listByUser
);
router.get(
  "/api/posts/feed/:userId",
  authCtrl.requireSignin,
  postCtrl.listNewsFeed
);

router.put("/api/posts/like", authCtrl.requireSignin, postCtrl.like);
router.put("/api/posts/unlike", authCtrl.requireSignin, postCtrl.unlike);

router.put("/api/posts/comment", authCtrl.requireSignin, postCtrl.comment);
router.put("/api/posts/uncomment", authCtrl.requireSignin, postCtrl.uncomment);

router.delete(
  "/api/posts/:postId",
  authCtrl.requireSignin,
  postCtrl.isPoster,
  postCtrl.remove
);

router.param("userId", userCtrl.userByID);
router.param("postId", postCtrl.postById);

export default router;
