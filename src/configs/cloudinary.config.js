import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME as cloud_name, API_KEY as api_key, API_SECRET as api_secret } from "./env.config.js";
// Configurations for cloudinary where the images are uploaded to get a secure url.
cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});

export default async (file) => {
    return await cloudinary.uploader.upload(file.path);
}