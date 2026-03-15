import axiosInstance from "./axiosInstance";

const toArray = (data) => (Array.isArray(data) ? data : []);

/**
 * Create a new microlocation
 * @param {Object} payload - { name, description, image, country, state, city }
 * @returns {Promise<Object>} API response data
 */
export const createMicrolocation = async (payload) => {
  const { data } = await axiosInstance.post(
    "/api/admin/microlocations",
    payload
  );
  return data;
};

/**
 * Update microlocation by ID
 * @param {string} id - Microlocation ID
 * @param {Object} payload - { name, description, image, country, state, city, active }
 * @returns {Promise<Object>} API response data
 */
export const updateMicrolocationById = async (id, payload) => {
  const { data } = await axiosInstance.put(
    `/api/admin/micro-by-id/${id}`,
    payload
  );
  return data;
};

/**
 * Get states by country ID
 * @param {string} countryId
 * @returns {Promise<Array>} List of states
 */
export const getStatesByCountry = async (countryId) => {
  const { data } = await axiosInstance.post(
    "/api/admin/statesbycountry",
    { country_id: countryId }
  );
  return toArray(data);
};

/**
 * Get cities by state ID
 * @param {string} stateId
 * @returns {Promise<Array>} List of cities
 */
export const getCitiesByState = async (stateId) => {
  const { data } = await axiosInstance.post(
    "/api/admin/citybystate",
    { state_id: stateId }
  );
  return toArray(data);
};

/**
 * Get all microlocations
 * @returns {Promise<Array>} List of microlocations
 */
export const getMicrolocations = async () => {
  const { data } = await axiosInstance.get("/api/admin/locations");
  const list = Array.isArray(data) ? data : data?.data ?? data?.locations ?? [];
  return Array.isArray(list) ? [...list].reverse() : [];
};

/**
 * Delete microlocation by ID
 * @param {string} id - Microlocation ID
 * @returns {Promise<Object>} API response data
 */
export const deleteMicrolocationById = async (id) => {
  const { data } = await axiosInstance.delete(
    `/api/admin/microlocation/delete/${id}`
  );
  return data;
};
