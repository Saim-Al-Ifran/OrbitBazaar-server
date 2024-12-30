import cloudinary from "../config/cloudinary";
import { CloudinaryDeleteResponse } from "../types/types";

export const deleteFileFromCloudinary = async (
  cloudinaryURL: string
): Promise<CloudinaryDeleteResponse | null> => {
  try {
    // Verify if the URL is from Cloudinary
    if (!isCloudinaryUrl(cloudinaryURL)) {
      console.warn(`Skipping deletion. Not a Cloudinary URL: ${cloudinaryURL}`);
      return null; // Return null for non-Cloudinary URLs
    }

    // Extract the public ID from the Cloudinary URL
    const regex = /\/v\d+\/([^\/]+\/[^\.]+)\./;
    const match = cloudinaryURL.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      // Delete the resource from Cloudinary
      const result: CloudinaryDeleteResponse = await cloudinary.uploader.destroy(publicId);
      return result;
    } else {
      throw new Error("Invalid Cloudinary URL format");
    }
  } catch (error: any) {
    console.error("Cloudinary deletion error:", error);

    if (error.message.includes("Unexpected token < in JSON")) {
      throw new Error("Failed to delete resource from Cloudinary. Non-JSON response received.");
    } else {
      throw new Error(`Failed to delete resource from Cloudinary: ${error.message}`);
    }
  }
};

// Helper function to check if a URL belongs to Cloudinary
const isCloudinaryUrl = (url: string): boolean => {
  return url.includes("res.cloudinary.com");
};
