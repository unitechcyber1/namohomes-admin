import api from "./axiosInstance";

/**
 * Save media image
 */
export const createMedia = async (payload) => {
  try {
    const { data } = await api.post(
      "/api/admin/media/upload",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all media images
 */
export const getAllMedia = async () => {
  try {
    const { data } = await api.get(
      "/api/admin/media/images"
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete media image
 */
export const deleteMediaById = async (id) => {
  try {
    const { data } = await api.delete(
      `/api/admin/image/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
