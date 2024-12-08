
import mongoose, { Schema, mongo } from "mongoose";
import Review from "./review.js";


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
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: String,
    enum: ["Trending", "Rooms", "Iconic cities", "Mountains", "Castle", "Amazing pool", "Camping", "Farms", "Artic", "Golfing", "Lake"],
    required: true
  }
});

listingSchema.post("findOneAndDelete", async(lisitng)=>{
  if (lisitng) {
    await Review.deleteMany({_id: {$in: lisitng.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
