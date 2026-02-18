import api from "./axiosInstance";

/**
 * Get SEO list
 */
export const getSeoList = async () => {
  try {
    const { data } = await api.get("/api/admin/seos");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get SEO by ID
 */
export const getSeoById = async (id) => {
  try {
    const { data } = await api.get(`/api/admin/seos/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete SEO (dynamic type)
 */
export const deleteSeoById = async ({ id }) => {
  const { data } = await api.delete(`/api/admin/seo/delete/${id}`);
  return data;
};

export const createSeo = async ({ payload }) => {
  const { data } = await api.post("/api/admin/seos", payload);
  return data;
};

/**
 * Update SEO
 */
export const updateSeo = async ({ id, payload }) => {
  const { data } = await api.put(`/api/admin/seos/${id}`, payload);
  return data;
};