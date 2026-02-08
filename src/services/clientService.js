import api from "./axiosInstance";

/**
 * Get all clients
 */
export const getClients = async () => {
  try {
    const { data } = await api.get("/api/admin/clients");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create client
 */
export const createClient = async (payload) => {
  try {
    const { data } = await api.post("/api/admin/client", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete client
 */
export const deleteClientById = async (id) => {
  try {
    const { data } = await api.delete(
      `/api/admin/client/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
