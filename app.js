import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { link } from "fs";
import asyncWrap from "./utils/wrapAsync.js";
import expressError from "./utils/expressError.js";
import listingSchema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = "mongodb://127.0.0.1:27017/wanderlust";
const PORT = process.env.PORT || 5000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // To parse the data from request parameters
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

async function main() {
  await mongoose.connect(url);
}
main()
  .then((res) => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

const validateListing = (req, res, next)=>{
  let { error } = listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, error);
  }else{
    next();
  }
}

app.get("/", (req, res) => {
  res.redirect("/listing");
});

//Index route
app.get("/listing", asyncWrap( async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
}));

//New route
app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
app.get("/listing/:id", asyncWrap (async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Create route
app.post("/listings", validateListing, asyncWrap (async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

//Edit Route
app.get("/listing/:id/edit", asyncWrap (async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listing/:id", validateListing, asyncWrap (async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(listing);
  res.redirect(`/listing/${id}`);
}));

//Delete Route
app.delete("/listing/:id/delete", asyncWrap ( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
}));


app.all("*", (req, res, next) => {
  next( new expressError(404, "Page Not Found!"));
});

//Error handler Middleware
app.use((err, req, res, next)=> {
  let { status=500, message="Something Went Wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

//Test listing
// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "my new villa",
//     description: "by the beach",
//     price: 7999,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save().then(() => {
//     console.log('Data was saved');
//   }).catch((err) => {
//     console.log(err);
//   })

//   res.send("Testing successful");
// });

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
