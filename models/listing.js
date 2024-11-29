
import mongoose, { Schema, mongo } from "mongoose";
import Review from "./review.js";
import User from './user.js';

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
    url: String,
    filename: String,
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
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async(lisitng)=>{
  if (lisitng) {
    await Review.deleteMany({_id: {$in: lisitng.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
