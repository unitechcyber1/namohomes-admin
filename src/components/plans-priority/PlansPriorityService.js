import BASE_URL from "../../apiConfig";
import axios from "axios";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getPropertyTypes = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/propertyTypes`
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
      throw createUserFriendlyError(error, "Failed to load projects. Please try again.");
    }
  };
  
  export const getTopProjectsByPlanType = async (plansId, city) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/plans-projects/${plansId}/${city}`
      );
      return data;
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to load projects. Please try again.");
    }
  };

  export const changePlanOrderOfProjectsByDrag = async (data) => {
    try {
      return await axios.put(
        `${BASE_URL}/api/admin/project/plans-priority`,
        data
      );
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };

  export const changePlanOrderOfProjects = async (data, id) => {
    try {
      return await axios.put(
        `${BASE_URL}/api/admin/project/plans-order/${id}`, data
      );
    } catch (error) {
      throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
    }
  };