import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;

cloudinary.config({
  cloud_name: "dt3plsk0g",
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret, 
});


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath)
        {
            return null;
        }
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("File uploaded on cloudinary")
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the file from local storage.  
    }
}

export {uploadOnCloudinary}