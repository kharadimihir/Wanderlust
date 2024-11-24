
import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max : 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
}, { timestamps: true});

const Review = mongoose.model("Review", reviewSchema)

export default Review