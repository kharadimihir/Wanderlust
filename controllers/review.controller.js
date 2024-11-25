import Review from "../models/review.js";
import Listing from "../models/listing.js";
import expressError from "../utils/expressError.js";
import { listingSchema } from "../schema.js";
import { reviewSchema } from "../schema.js";

const createNewReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new expressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created")
    res.redirect(`/listing/${listing._id}`);
};



const deleteReview = async(req, res)=>{
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Delete Review")
    res.redirect(`/listing/${id}`);
};

export default {
    createNewReview,
    deleteReview
}