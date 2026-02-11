import axiosInstance from "./axiosInstance";

/**
 * Get countries
 */

export const createMicrolocation = async (payload) => {
  const { data } = await axiosInstance.post(
    "/api/admin/microlocation/microlocations",
    payload
  );
  return data;
};
/**
 * Get states by country
 */
export const getStatesByCountry = async (countryId) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/statesbycountry",
      { country_id: countryId }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get cities by state
 */
export const getCitiesByState = async (stateId) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/citybystate",
      { state_id: stateId }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get microlocations
 */
export const getMicrolocations = async () => {
  try {
    const { data } = await axiosInstance.get("/api/admin/locations");
    return data.reverse();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete microlocation
 */
export const deleteMicrolocationById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      `/api/admin/microlocation/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
