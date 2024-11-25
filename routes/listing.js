import { Router } from "express";
import asyncWrap from "../utils/wrapAsync.js";
import { isOwner, userLoggedIn, validateListing } from "../middlewares.js";
import listingController from "../controllers/listing.controller.js";

const router = Router();

// Routes
router.get("/home", (req, res) => {
  res.redirect("/listing");
});

router.get(
  "/listing",
  asyncWrap(listingController.index)
);

router.get("/listing/new", userLoggedIn, listingController.renderNewForm);


router
.route("/listing/:id")
.get(asyncWrap(listingController.showListing))
.put(userLoggedIn,
  isOwner,
  validateListing,
  asyncWrap(listingController.updateListing)
)

router.post(
  "/listings",
  userLoggedIn,
  validateListing,
  asyncWrap(listingController.createListing)
);

router.get(
  "/listing/:id/edit",
  userLoggedIn,
  isOwner,
  asyncWrap(listingController.renderEditForm)
);

router.delete(
  "/listing/:id/delete",
  userLoggedIn,
  isOwner,
  asyncWrap(listingController.deleteListing)
);

export default router;
