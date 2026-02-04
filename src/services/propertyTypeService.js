import axiosInstance from "./axiosInstance";

/**
 * Get all property types
 */
export const getPropertyTypes = async () => {
  try {
    const { data } = await axiosInstance.get("/api/admin/propertyTypes");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create property type
 */
export const createPropertyType = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/propertyTypes",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete property type
 */
export const deletePropertyTypeById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      `/api/admin/propertyType/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
