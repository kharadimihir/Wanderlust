import mongoose from "mongoose";
import  initData  from "./data.js"
import Listing from "../models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Data was saved successfully");
}).catch((err) => {
    console.log(err);
})

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData);
    console.log("Data was initialized");
}

initDB();