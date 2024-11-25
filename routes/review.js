import asyncWrap from "../utils/wrapAsync.js";
import { Router } from "express";
import { reviewOwner, userLoggedIn }from "../middlewares.js";
import { saveRedirectUrl } from "../middlewares.js";
import { validateReview } from "../middlewares.js";
import reviewController from "../controllers/review.controller.js";

const router = Router({mergeParams: true});

router.post("/:id", userLoggedIn, saveRedirectUrl, validateReview, asyncWrap(reviewController.createNewReview));
  
  
router.delete("/:id/reviews/:reviewId", userLoggedIn, saveRedirectUrl, reviewOwner, asyncWrap(reviewController.deleteReview));

export default router