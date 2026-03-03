import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import "dotenv/config";

const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;

cloudinary.config({
  cloud_name: "dt3plsk0g",
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret, 
});


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        console.log(cloudinary_api_key)
        if(!localFilePath)
        {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("File uploaded on cloudinary")
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error)
        fs.unlinkSync(localFilePath) // remove the file from local storage.  
    }
}

export {uploadOnCloudinary}