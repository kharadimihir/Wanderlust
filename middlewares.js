import expressError from "./utils/expressError.js";
import Listing from "./models/listing.js";
import Review from "./models/review.js";
import { reviewSchema } from "./schema.js";
import { listingSchema } from "./schema.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";


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

const tempFolder = "./public/temp";
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
}

// Define storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempFolder); // Upload to the "temp" folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname); // Get the original file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`); // Create unique filename
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
  } else {
      cb(new Error("Invalid file type. Only images are allowed."), false); // Reject the file
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter, // Apply the file filter
});



export { userLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, reviewOwner, upload };
