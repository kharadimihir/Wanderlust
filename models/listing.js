import pkg from 'joi';
import mongoose, { Schema, mongo } from "mongoose";
import Review from "./review.js"

// const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1709884735646-897b57461d61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1709884735646-897b57461d61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D"
        : v,
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

listingSchema.post("findOneAndDelete", async(lisitng)=>{
  if (lisitng) {
    await Review.deleteMany({_id: {$in: lisitng.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
