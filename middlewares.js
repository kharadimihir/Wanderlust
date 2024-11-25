import expressError from "./utils/expressError.js";
import Listing from "./models/listing.js";
import Review from "./models/review.js";
import { reviewSchema } from "./schema.js";
import { listingSchema } from "./schema.js";


const userLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl.split("/reviews/")[0];
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; 
    delete req.session.redirectUrl;
  }
  next();
};

const isOwner = async(req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!(listing.owner._id.equals(res.locals.currUser._id))) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listing/${id}`)
  }
  next()
};

const reviewOwner = async(req, res, next) => {
  let { reviewId, id} = req.params;
  let review = await Review.findById(reviewId);
  if(!(review.author.equals(res.locals.currUser._id))){
    req.flash("error", "You are not the owner of this review");
    return res.redirect(`/listing/${id}`);
  }
  next()
}

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
// Validate review
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};


export { userLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, reviewOwner };
