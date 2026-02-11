import axiosInstance from "./axiosInstance";

/**
 * Fetch all cities
 */
export const getCountries= async () => {
  try {
    const { data } = await axiosInstance.get("/api/admin/allCountry/country");
    return data;
  } catch (error) {
    throw error; 
  }
};

/**
 * Delete city by ID
 */
export const deleteCountryById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      `/api/admin/allCountry/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
