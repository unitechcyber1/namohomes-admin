import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getProjectsDataByCity = async (
  setLoading,
  setProjects,
  cityId
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/project-details/${cityId}`
    );
    setProjects(data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    throw createUserFriendlyError(error, "Failed to load projects. Please try again.");
  }
};

export const changeOrderOfProjects = async (data, id, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      return await axios.put(
        `${BASE_URL}/api/admin/dwarkaProject/top-projects/${id}`, data
      );
    }
    if (!url.includes("dwarkaexpressway")) {
      return await axios.put(
        `${BASE_URL}/api/admin/project/best-projects/${id}`, data
        );
    }
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project order. Please try again.");
  }
};
export const changeOrderOfProjectsByDrag = async (data, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      return await axios.put(
        `${BASE_URL}/api/admin/dwarkaProject/update-top-projects`, data
      );
    }
    if (!url.includes("dwarkaexpressway")) {
      return await axios.put(
        `${BASE_URL}/api/admin/project/update-top-projects`,
        data
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
        `${BASE_URL}/api/admin/dwarkaProject/projects-by-order/${cityId}`
      );
      return data;
    }
    if (!url.includes("dwarkaexpressway")) {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/projects-by-order/${cityId}`
      );
      return data;
    }
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load top projects. Please try again.");
  }
};
