import axiosInstance from "./axiosInstance";

/**
 * Fetch all cities
 */
export const getCountries = async () => {
  try {
    const { data } = await axiosInstance.get("/api/admin/countries");
    return data.country;
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
      `/api/admin/country/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const createCountry = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/country",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};
