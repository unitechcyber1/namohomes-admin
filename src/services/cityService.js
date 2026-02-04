import axiosInstance from "./axiosInstance";

/**
 * Fetch all cities
 */
export const getCities = async () => {
  try {
    const { data } = await axiosInstance.get("/api/admin/cities");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete city by ID
 */
export const deleteCityById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      `/api/admin/city/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
