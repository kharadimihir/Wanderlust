import Listing from "../models/listing.js";
import { uploadOnCloudinary } from "../cloudConfig.js";
import { geocodeAddress } from "../geocode.js";



const index = async (req, res) => {
  let { searchType, searchQuery, category, price } = req.query;
  let allListings;
  price = Number(searchQuery);
  try {
    // Handle search by type (location, country, price, category)
    if (searchType === "location") {
      allListings = await Listing.find({
        location: { $regex: searchQuery, $options: "i" },
      });
    } else if (searchType === "country") {
      allListings = await Listing.find({
        country: { $regex: searchQuery, $options: "i" },
      });
    } else if (searchType === "price") {
      const maxPrice = Number(price);
      if (isNaN(maxPrice) || maxPrice <= 0) {
        req.flash("error", "Please provide a valid price.");
        return res.redirect("/listing");
      }
      allListings = await Listing.find({ price: { $lte: maxPrice } });
    } else if (searchType === "category" && category) {
      allListings = await Listing.find({ category });
    } else {
      if (category) {
        allListings = await Listing.find({ category });
      } else {
        allListings = await Listing.find();
      }
    }

    if (!allListings || allListings.length === 0) {
      req.flash("error", "No listings found matching your search criteria.");
      return res.redirect("/listing");
    }

    res.render("listings/index", { allListings });
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while performing the search.");
    res.redirect("/listing");
  }
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
    if (!cloudinaryResponse) {
      req.flash("error", "Image upload failed. Please try again.");
      return res.redirect("/listing/new");
    }

    // Check if the category is provided
    const { category } = req.body.listing;
    const allowedCategories = [
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castle",
      "Amazing pool",
      "Camping",
      "Farms",
      "Artic",
      "Golfing",
      "Lake",
    ];

    if (!category || !allowedCategories.includes(category)) {
      req.flash(
        "error",
        "Invalid or missing category. Please select a valid category."
      );
      return res.redirect("/listing/new");
    }

    // Create the new listing with the uploaded image details
    const newListing = new Listing(req.body.listing);
    const address = newListing.location;
    const response = await geocodeAddress(address);
    newListing.owner = req.user._id; // Assuming `req.user` is populated
    newListing.image = {
      url: cloudinaryResponse.url, // Cloudinary image URL
      filename: cloudinaryResponse.public_id, // Cloudinary public ID for the image
    };
    newListing.geometry = {
      type: "Point", // Always set to "Point" for GeoJSON
      coordinates: [response.lng, response.lat],
    };

    // Save the listing to the database
    let savedListing = await newListing.save();

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

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_200");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    listing.image = {
      url: cloudinaryResponse.url, // Cloudinary image URL
      filename: cloudinaryResponse.public_id, // Cloudinary public ID for the image
    };
  }

  await listing.save();
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
  deleteListing,
};
