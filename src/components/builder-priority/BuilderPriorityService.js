import BASE_URL from "../../apiConfig";
import axios from "axios";
import { createUserFriendlyError } from "../../utils/errorHandler";
export const getProjectsDataByBuilder = async (builderId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/projects-by-builder/${builderId}`
      );
  
     return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load builder projects. Please try again.");
    }
  };
  
  export const getTopProjectsByBuilder = async (builderId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/builder-projects/${builderId}`
      );
  return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load builder projects. Please try again.");
    }
  };
  