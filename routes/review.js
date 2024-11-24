import Listing from "../models/listing.js";
import Review from "../models/review.js";
import asyncWrap from "../utils/wrapAsync.js";
import expressError from "../utils/expressError.js";
import { reviewSchema } from "../schema.js";
import { Router } from "express";
import { isOwner, reviewOwner, userLoggedIn }from "../middlewares.js";
import { saveRedirectUrl } from "../middlewares.js";
import { validateReview } from "../middlewares.js";

const router = Router({mergeParams: true});

router.post("/:id", userLoggedIn, saveRedirectUrl, validateReview, asyncWrap(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new expressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user;
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created")
    res.redirect(`/listing/${listing._id}`);
  }));
  
  
  router.delete("/:id/reviews/:reviewId", userLoggedIn, saveRedirectUrl, reviewOwner, asyncWrap(async(req, res)=>{
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Delete Review")
    res.redirect(`/listing/${id}`);
  }));

  export default router