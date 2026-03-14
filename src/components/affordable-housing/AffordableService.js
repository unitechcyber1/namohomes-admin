import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const changeOrderOfProjects = async (data, id) => {
  try {
    return await axios.put(
      `${BASE_URL}/api/admin/project/affordable-projects/${id}`, data
    );
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
  }
};

export const getTopProjectsByCity = async (cityId) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/affordable-order/${cityId}`
    );
    return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
  }
};

export const changeOrderOfProjectsByDrag = async (data) => {
  try {
    return await axios.put(
      `${BASE_URL}/api/admin/project/update-affordable-projects`, data
    );
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
  }
};
  