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
export const deleteSeoById = async ({ id, type }) => {
  const path =
    type === "dwarka"
      ? `/api/admin/dwarka/delete/${id}`
      : `/api/admin/seo/delete/${id}`;

  const { data } = await api.delete(path);
  return data;
};

export const createSeo = async ({ payload, type }) => {
  const path =
    type === "dwarka"
      ? "/api/admin/dwarka/seos"
      : "/api/admin/seo/seos";

  const { data } = await api.post(path, payload);
  return data;
};

/**
 * Update SEO
 */
export const updateSeo = async ({ id, payload, type }) => {
  const path =
    type === "dwarka"
      ? `/api/admin/dwarka/seos/${id}`
      : `/api/admin/seo/seos/${id}`;

  const { data } = await api.put(path, payload);
  return data;
};