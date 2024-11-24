import { Router } from "express";
import User from "../models/user.js";
import asyncWrap from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middlewares.js";

const router = Router();

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err)=>{
        if(err){
          next(err)
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listing");
      })
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Waderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  }
);
router.get("/logout", (req, res, next)=>{
  req.logout((err)=>{
    if(err){
      next(err)
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listing");
  })
})

export default router;
