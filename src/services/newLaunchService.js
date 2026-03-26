import api from "./axiosInstance";
import { createUserFriendlyError } from "../utils/errorHandler";

export const changeOrderOfProjects = async (data, id) => {
  try {
    return await api.put(`/api/admin/newlaunch-projects/${id}`, data);
  } catch (error) {
    throw createUserFriendlyError(
      error,
      "Failed to update project order. Please try again."
    );
  }
};

export const getTopProjectsByCity = async (params, cityId) => {
  try {
    const { data } = await api.get(
      `/api/admin/newlaunch-order/${cityId}`,
      { params }
    );
    return data;
  } catch (error) {
    throw createUserFriendlyError(
      error,
      "Failed to load new launch order. Please try again."
    );
  }
};

export const changeOrderOfProjectsByDrag = async (data) => {
  try {
    return await api.put(
      `/api/admin/update-newlaunch-projects`,
      data
    );
  } catch (error) {
    throw createUserFriendlyError(
      error,
      "Failed to update project order. Please try again."
    );
  }
};
