import express from "express";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/signin", authCtrl.signin);
router.post("/auth/signout", authCtrl.signout);

export default router;
