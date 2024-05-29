import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//register user
router.route("/register").post(upload.single("avatar"), registerUser);
//login
router.route("/login").post(loginUser);

export default router;
