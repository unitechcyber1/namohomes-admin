import api from "./axiosInstance";

/**
 * Get builders (simple list)
 */
export const getBuilders = async () => {
  try {
    const { data } = await api.get("/api/admin/builders");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all builders (paginated/filterable)
 */
export const getAllBuilders = async (params = {}) => {
  try {
    const { data } = await api.get(
      "/api/admin/allbuilders",
      { params }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get builder by id
 */
export const getBuilderById = async (id) => {
  try {
    const { data } = await api.get(
      `/api/admin/builders/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete builder
 */
export const deleteBuilderById = async (id) => {
  try {
    const { data } = await api.delete(
      `/api/admin/builder/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get cities (shared helper — reusable)
 */
export const getCities = async () => {
  const { data } = await api.get("/api/admin/cities");
  return data;
};

export const createBuilder = async (payload) => {
  const { data } = await api.post(
    "/api/admin/builder",
    payload
  );
  return data;
};

/**
 * Update builder
 */
export const updateBuilder = async (id, payload) => {
  const { data } = await api.put(
    `/api/admin/builder/edit-builder/${id}`,
    payload
  );
  return data;
};