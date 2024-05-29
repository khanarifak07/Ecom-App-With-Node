import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

//register user
router.route("/register").post(registerUser);
//login
router.route("/login").post();

export default router;
