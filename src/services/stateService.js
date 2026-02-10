import axiosInstance from "./axiosInstance";

/**
 * Fetch all state
 */
export const getStateData = async () => {
  try {
    const { data } = await axiosInstance.get("/api/admin/states");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete state by ID
 */
export const deleteStateById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      `/api/admin/state/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
