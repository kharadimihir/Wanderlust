import axios from "axios";
import expressError from "./utils/expressError.js";
import dotenv from "dotenv";
dotenv.config();

const geocodeAddress = async (address) => {
    const apiKey = process.env.MAP_TOKEN;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.results.length > 0) {
            const coordinates = response.data.results[0].geometry;
            return coordinates; // Return the coordinates (latitude and longitude)
        }else{
            console.error('Geocoding error:', error);
            throw new expressError(404, "Error");
        }
        
    } catch (error) {
        throw new expressError(404, "Error while converting address");
    }
}

// let address = 'Delhi, India'
// geocodeAddress(address);
export { geocodeAddress }