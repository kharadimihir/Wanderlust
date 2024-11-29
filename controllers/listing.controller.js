import Listing from "../models/listing.js";
import { uploadOnCloudinary } from "../cloudConfig.js";



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
    try {
        // Check if a file was uploaded
        if (!req.file) {
            req.flash("error", "Please upload an image.");
            return res.redirect("/listing/new");
        }
        // Upload the file to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        //console.log(cloudinaryResponse);

        if (!cloudinaryResponse) {
            req.flash("error", "Image upload failed. Please try again.");
            return res.redirect("/listing/new");
        }

        // Create the new listing with the uploaded image details
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Assuming `req.user` is populated
        newListing.image = {
            url: cloudinaryResponse.url, // Cloudinary image URL
            filename: cloudinaryResponse.public_id, // Cloudinary public ID for the image
        };

        // Save the listing to the database
        await newListing.save();

        // Flash success message and redirect
        req.flash("success", "New Listing Created!");
        res.redirect("/listing");
    } catch (error) {
        console.error(error); // Log the error for debugging
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listing/new");
    }
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