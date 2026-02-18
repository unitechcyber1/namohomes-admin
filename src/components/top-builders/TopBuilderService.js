import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const changeOrderOfBuilder = async (data, id) => {
    try {
        return await axios.put(
          `${BASE_URL}/api/admin/builder/update-order/${id}`, data
          );
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update builder order. Please try again.");
    }
  };
  export const changeOrderOfBuildersByDrag = async (data) => {
    try {
        return await axios.put(
          `${BASE_URL}/api/admin/builder/change-order`,
          data
        );
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update builder order. Please try again.");
    }
  };
  
  export const getTopBuilders = async () => {
    try {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/builder/top-builders`
        );
        return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update builder order. Please try again.");
    }
  };