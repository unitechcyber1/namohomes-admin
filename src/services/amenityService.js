import api from "./axiosInstance";

/* ---------------------------------- */
/*           GET ALL                  */
/* ---------------------------------- */

export const getAmenities = async () => {
  try {
    const { data } = await api.get("/api/admin/amenity");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ---------------------------------- */
/*           GET BY ID                */
/* ---------------------------------- */

export const getAmenityById = async (id) => {
  try {
    const { data } = await api.get(
      `/api/admin/amenity/${id}`
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ---------------------------------- */
/*           CREATE                   */
/* ---------------------------------- */

export const createAmenity = async (payload) => {
  try {
    const { data } = await api.post(
      "/api/admin/amenities",
      payload
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ---------------------------------- */
/*           UPDATE                   */
/* ---------------------------------- */

export const updateAmenity = async (id, payload) => {
  try {
    const { data } = await api.put(
      `/api/admin/amenity-by-id/${id}`,
      payload
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ---------------------------------- */
/*           DELETE                   */
/* ---------------------------------- */

export const deleteAmenityById = async (id) => {
  try {
    const { data } = await api.delete(
      `/api/admin/amenity/delete/${id}`
    );
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

/* ---------------------------------- */
/*        ERROR NORMALIZER            */
/* ---------------------------------- */

const normalizeError = (error) => {
  return (
    error?.response?.data ||
    error?.message ||
    "Something went wrong"
  );
};
