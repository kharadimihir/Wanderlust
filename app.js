import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import asyncWrap from "./utils/wrapAsync.js";
import expressError from "./utils/expressError.js";
import { listingSchema, reviewSchema } from "./schema.js";
import Review from "./models/review.js";
import Joi from "joi";

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection URL
const url = "mongodb://127.0.0.1:27017/wanderlust";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// View engine and views setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use(methodOverride("_method"));

// Database connection
async function main() {
  await mongoose.connect(url);
}
main()
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

// Validation middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};


// Routes
app.get("/", (req, res) => {
  res.redirect("/listing");
});

app.get("/listing", asyncWrap(async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
}));

app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listing/:id", asyncWrap(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));

app.post("/listings", validateListing, asyncWrap(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
}));

app.get("/listing/:id/edit", asyncWrap(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

app.put("/listing/:id", validateListing, asyncWrap(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(listing);
  res.redirect(`/listing/${id}`);
}));

app.post("/listing/:id/reviews", validateReview, asyncWrap(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new expressError(404, "Listing not found");
  }
  
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listing/${listing._id}`);
}));

app.delete("/listing/:id/delete", asyncWrap(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
}));

app.delete("/listing/:id/reviews/:reviewId", asyncWrap(async(req, res)=>{
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});

  res.redirect(`/listing/${id}`);
}));

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
