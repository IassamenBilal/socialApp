import express from "express";
const router = express.Router();
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

router.get("/api/users", userCtrl.list);
router.post("/api/users", userCtrl.create);
router.route("/api/users/photo/:userId").get(userCtrl.photo);

router.put(
  "/api/users/notifylike",
  authCtrl.requireSignin,
  userCtrl.notifyLike
);
router.put(
  "/api/users/follow",
  authCtrl.requireSignin,
  userCtrl.addFollowing,
  userCtrl.addFollower
);

router.put(
  "/api/users/unfollow",
  authCtrl.requireSignin,
  userCtrl.removeFollowing,
  userCtrl.removeFollower
);

router.get(
  "/api/users/notifications/:userId",
  authCtrl.requireSignin,
  userCtrl.getNotifications
);

router.get(
  "/api/users/findpeople/:userId",
  authCtrl.requireSignin,
  userCtrl.findPeople
);

router.get("/api/users/:userId", authCtrl.requireSignin, userCtrl.read);
router.put(
  "/api/users/:userId",
  authCtrl.requireSignin,
  authCtrl.hasAuthorization,
  userCtrl.update
);

router.delete(
  "/api/users/:userId",
  authCtrl.requireSignin,
  authCtrl.hasAuthorization,
  userCtrl.remove
);

router.param("userId", userCtrl.userByID);
export default router;
