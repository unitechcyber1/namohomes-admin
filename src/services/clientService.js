import api from "./axiosInstance";

/**
 * @typedef {Object} GetClientsParams
 * @property {number} [page=1]
 * @property {number} [limit=10]
 * @property {string} [search] - optional search string
 * @property {"all"|"true"|"false"} [active="all"] - matches API: all | true | false
 */

/**
 * @typedef {Object} ClientsListResult
 * @property {Array} clients
 * @property {number} totalCount
 * @property {number} totalPages
 * @property {number} page
 * @property {number} limit
 * @property {string|null} search
 * @property {string} active
 */

/**
 * Fetch clients (paginated). API returns:
 * { totalCount, totalPages, page, limit, search, active, clients }
 *
 * @param {GetClientsParams} params
 * @returns {Promise<ClientsListResult>}
 */
export const getClients = async (params = {}) => {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 10;

  const query = {
    page,
    limit,
  };

  if (params.search != null && String(params.search).trim() !== "") {
    query.search = String(params.search).trim();
  }

  const active = params.active ?? "all";
  if (active === "true" || active === "false" || active === "all") {
    query.active = active;
  }

  const { data } = await api.get("/api/admin/clients", { params: query });

  // Backward compatibility: plain array
  if (Array.isArray(data)) {
    return {
      clients: data,
      totalCount: data.length,
      totalPages: 1,
      page: 1,
      limit,
      search: null,
      active: "all",
    };
  }

  const clients = Array.isArray(data?.clients) ? data.clients : [];

  return {
    clients,
    totalCount: data?.totalCount ?? clients.length,
    totalPages: Math.max(0, Number(data?.totalPages) || 0),
    page: data?.page != null ? Number(data.page) : page,
    limit: data?.limit != null ? Number(data.limit) : limit,
    search: data?.search ?? null,
    active: data?.active ?? "all",
  };
};

/**
 * Create client
 */
export const createClient = async (payload) => {
  const { data } = await api.post("/api/admin/client", payload);
  return data;
};

/**
 * Delete client
 */
export const deleteClientById = async (id) => {
  const { data } = await api.delete(`/api/admin/client/delete/${id}`);
  return data;
};
