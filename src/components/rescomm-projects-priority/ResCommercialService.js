import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const changeOrderOfProjects = async (data, id, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/rescomm-order/${id}`, data
        );
      }
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };
  
  export const getTopProjectsByCity = async (params, cityId, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/dwarkaProject/rescomm-projects/${cityId}`, {params}
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
          `${BASE_URL}/api/admin/dwarkaProject/rescomm-priority`, data
        );
      }
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };
  