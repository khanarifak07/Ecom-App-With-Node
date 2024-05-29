import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const uploadFilesOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;
    //upload to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded successfully on cloudinary", response.url);

    //check for file exists before unlinking file
    if (fs.existsSync(localFilePath)) {
      //unlink after successfull upload
      fs.unlinkSync(localFilePath);
    } else {
      console.warn("Local file not found: ", localFilePath);
    }
    //return response
    return response;
  } catch (error) {
    console.log("Error while uploading file to cloudianry", error);
    //check for file exitst before attempting unlink
    if (fs.existsSync(localFilePath)) {
      //unlink file after failure
      fs.unlinkSync(localFilePath);
    } else {
      console.warn("Local file not found after failure:", localFilePath);
    }
    return;
  }
};

export { uploadFilesOnCloudinary };
