
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import expressError from "./utils/expressError.js";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Cookie } from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import userRouter from "./routes/user.js"
import dotenv from "dotenv";
dotenv.config();


console.log(process.env.PORT, process.env.MONGO_URL, process.env.SECRET);

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection URL
//const mongodbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const mongodbUrl = process.env.MONGO_URL;
// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// View engine and views setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use(methodOverride("_method"));

async function main() {
  try {
    mongoose.set('debug', true);
    mongoose.connect(mongodbUrl);
    console.log("Connection Successful");
  } catch (err) {
    console.log("Connection Failed:", err);
  }
}

main();


  
const store = MongoStore.create({
  mongoUrl: mongodbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in mongo session store", error);
})
const sessionOption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Proper Date object
    httpOnly: true, // Ensures the cookie is accessible only by the web server
  },
};

app.use(session(sessionOption));
app.use(flash());

// Password and authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listing", reviewRouter)
app.use("/", listingRouter)
app.use("/", userRouter)





// Catch-all for unknown routes
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
