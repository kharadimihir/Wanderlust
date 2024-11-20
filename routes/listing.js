import { Router } from "express";
import asyncWrap from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import expressError from "../utils/expressError.js";
import { listingSchema } from "../schema.js";


const router = Router();

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







// Routes
router.get("/home", (req, res) => {
    res.redirect("/listing");
});
  
router.get("/listing", asyncWrap(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  }));
  
  router.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  router.get("/listing/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing that you are trying to access is not exsist")
      res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
  }));
  
  router.post("/listings", validateListing, asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listing");
  }));
  
  router.get("/listing/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing that you are trying to access is not exsist")
      res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
  }));
  
  router.put("/listing/:id", validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Update listing")
    res.redirect(`/listing/${id}`);
  }));

  router.delete("/listing/:id/delete", asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Delete listing")
    res.redirect("/listing");
  }));


export default router