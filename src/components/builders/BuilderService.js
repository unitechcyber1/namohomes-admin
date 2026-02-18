import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getbuildersData = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/builders`);
    return data
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load builders. Please try again.");
  }
};
export const getAllbuildersData = async (params, url) => {
  try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/allbuilders`, {params}
      );
      return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load builders. Please try again.");
  }
};

export const getCity = async (setAllCity) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/cities`);
    setAllCity(data);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load cities. Please try again.");
  }
};

export const getbuildersDataById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/builders/${id}`);
    return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load builder details. Please try again.");
  }
};
export const deleteBuildersById = async (id) => {
  try {
    return await axios.delete(`${BASE_URL}/api/admin/builder/delete/${id}`);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to delete builder. Please try again.");
  }
};

