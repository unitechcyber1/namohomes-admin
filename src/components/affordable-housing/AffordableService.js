import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const changeOrderOfProjects = async (data, id, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/affordable-projects/${id}`, data
        );
      }
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };
  
  export const getTopProjectsByCity = async (cityId, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/dwarkaProject/affordable-order/${cityId}`
        );
        return data;
      }
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };

  export const changeOrderOfProjectsByDrag = async (data, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/update-affordable-projects`, data
        );
      }
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };
  