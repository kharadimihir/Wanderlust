import Listing from "../models/listing.js";
import Review from "../models/review.js";
import asyncWrap from "../utils/wrapAsync.js";
import expressError from "../utils/expressError.js";
import { reviewSchema } from "../schema.js";
import { Router } from "express";

const router = Router();

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    } else {
      next();
    }
  };

router.post("/:id/reviews", validateReview, asyncWrap(async (req, res) => {
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
  
  
  router.delete("/:id/reviews/:reviewId", asyncWrap(async(req, res)=>{
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  
    res.redirect(`/listing/${id}`);
  }));

  export default router