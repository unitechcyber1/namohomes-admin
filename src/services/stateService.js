import axiosInstance from "./axiosInstance";

export const getStates = async () => {
  const { data } = await axiosInstance.get("/api/admin/states");

  // normalize shapes
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.states)) return data.states;

  return [];
};

/**
 * Create state
 */
export const createState = async (payload) => {
  const { data } = await axiosInstance.post(
    "/api/admin/state",
    payload
  );
  return data;
};

/**
 * Delete state
 */
export const deleteStateById = async (id) => {
  const { data } = await axiosInstance.delete(
    `/api/admin/state/delete/${id}`
  );
  return data;
};
