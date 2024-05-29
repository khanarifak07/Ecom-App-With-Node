import { Router } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//register user
router.route("/register").post(upload.single("avatar"), registerUser);
//login
router.route("/login").post(loginUser);
//logout
router.route("/logout").post(verifyJWT, logoutUser);
//change current password
router.route("/change-current-password").post(verifyJWT, changeCurrentPassword);

export default router;
