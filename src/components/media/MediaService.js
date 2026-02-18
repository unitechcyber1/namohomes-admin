import BASE_URL from "../../apiConfig";
import axios from "axios";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const saveImage = async (data) => {
    try {
     return await axios.post(
        `${BASE_URL}/api/admin/media/upload`,
        data
      );
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to upload image. Please check the file format and try again.");
    }
  };

  export const allImages = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/media/images`);
      return data.data
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load images. Please try again.");
    }
  };