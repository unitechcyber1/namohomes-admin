import BASE_URL from "../../apiConfig";
import axios from "axios";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getPropertyTypes = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/propertyType/propertyTypes`
      );
      return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load property types. Please try again.");
    }
  };
export const getProjectsDataByPlanAndCity = async (plansId, city) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/projects-by-plans/${plansId}/${city}`
      );
  
     return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load property types. Please try again.");
    }
  };
  
  export const getTopProjectsByPlanType = async (plansId, city) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/plans-projects/${plansId}/${city}`
      );
  return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load property types. Please try again.");
    }
  };
  