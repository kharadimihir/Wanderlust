import User from "../models/user.js";


const renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


const signup = async (req, res) => {
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
};


const renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};



const login = async (req, res) => {
  req.flash("success", "Welcome back to Waderlust");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};



const logout = (req, res, next)=>{
    req.logout((err)=>{
      if(err){
        next(err)
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listing");
    })
};

export default {
    signup,
    renderSignupForm,
    renderLoginForm,
    login,
    logout
}