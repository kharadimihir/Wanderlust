import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
      if (!localFilePath) {
          console.error("Local file path is required for upload.");
          return null;
      }

      // Ensure the file exists before attempting upload
      if (!fs.existsSync(localFilePath)) {
          console.error("File does not exist at path:", localFilePath);
          return null;
      }

      console.log("Uploading file to Cloudinary...");
      const response = await cloudinary.v2.uploader.upload(localFilePath, {
          resource_type: resourceType,
      });

      // Delete the local file after successful upload
      fs.unlinkSync(localFilePath);

      return response;
  } catch (error) {
      console.error("Error uploading file to Cloudinary:", error.message);

      // Delete the local file if it exists
      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
      }

      return null;
  }
};

export { uploadOnCloudinary, cloudinary } 



//const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');


// cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.CLOUD_API_KEY,
//     api_secret:process.env.CLOUD_API_SECRET,

// })

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'Wanderlust_DEV',
//       allowedFormats: ["png","jpg","jpeg"],
//     },
//   });

//   module.exports={
//     cloudinary,
//     storage
//   }
























// const uploadToCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//             throw new expressError(404, "Error while uploading");
//         }

//         const respose = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         console.log("file is uploaded on cloudinary", respose.url);
//         return respose;
//     } catch (error) {
//         fs.unlinkSync(localFilePath)
//         return null;
//     }
// };

// export default { uploadToCloudinary, cloudinary }





















// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';

// // Cloudinary configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
//   secure: true
// });

// // Set up Cloudinary storage with multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: 'Wanderlust_DEV', // The folder where images will be uploaded
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image formats
//   }
// });

// export default { cloudinary, storage };



