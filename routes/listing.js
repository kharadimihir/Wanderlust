import { Router } from "express";
import asyncWrap from "../utils/wrapAsync.js";
import { isOwner, userLoggedIn, validateListing } from "../middlewares.js";
import listingController from "../controllers/listing.controller.js";
import multer from "multer";
import { cloudinary } from "../cloudConfig.js";
import { upload } from "../middlewares.js";


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
  upload.single(
    'listing[image]'
  ),
  //validateListing,
  asyncWrap(listingController.updateListing)
)

router.post(
  "/listings",
  userLoggedIn,
  upload.single(
    'listing[image]'
  ),
(err, req, res, next) => {
  if (err) {
    console.error("Multer Upload Error:", err.message);
    req.flash("error", "Image upload failed.");
    return res.redirect("/listing/new");
  }
  next();
},
  //validateListing,
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
