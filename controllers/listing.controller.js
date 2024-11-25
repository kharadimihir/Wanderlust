import Listing from "../models/listing.js";
import expressError from "../utils/expressError.js";

const index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};


const renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


const showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing that you are trying to access is not exsist");
      res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
};


const createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};


const renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing that you are trying to access is not exsist");
      res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
};


const updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Update listing");
    res.redirect(`/listing/${id}`);
};


const deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Delete listing");
    res.redirect("/listing");
};

export default {
    index,
    renderNewForm,
    showListing,
    createListing,
    renderEditForm,
    updateListing,
    deleteListing
}