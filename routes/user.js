import { Router } from "express";
import asyncWrap from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middlewares.js";
import userController from "../controllers/user.controller.js";

const router = Router();


router
.route("/signup")
.get(userController.renderSignupForm)
.post(asyncWrap(userController.signup))


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
)


router.get("/logout", userController.logout)


export default router;
