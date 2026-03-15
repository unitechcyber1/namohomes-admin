import axiosInstance from "./axiosInstance";

/**
 * Normalize API response to array of cities
 */
const normalizeCitiesResponse = (data) => {
  if (Array.isArray(data)) return data;
  return data?.cities ?? data?.data ?? data?.city ?? [];
};

/**
 * Fetch all cities
 * @returns {Promise<Array>} List of cities
 */
export const getCities = async () => {
  const { data } = await axiosInstance.get("/api/admin/cities");
  return normalizeCitiesResponse(data);
};

/**
 * Create a new city
 * @param {Object} payload - { name, description, country, state }
 * @returns {Promise<Object>} API response data
 */
export const createCity = async (payload) => {
  const { data } = await axiosInstance.post("/api/admin/cities", payload);
  return data;
};

/**
 * Update city by ID
 * @param {string} id - City ID
 * @param {Object} payload - { name, description, country, state, active }
 * @returns {Promise<Object>} API response data
 */
export const updateCityById = async (id, payload) => {
  const { data } = await axiosInstance.put(
    `/api/admin/city-by-id/${id}`,
    payload
  );
  return data;
};

/**
 * Delete city by ID
 * @param {string} id - City ID
 * @returns {Promise<Object>} API response data
 */
export const deleteCityById = async (id) => {
  const { data } = await axiosInstance.delete(
    `/api/admin/city/delete/${id}`
  );
  return data;
};
