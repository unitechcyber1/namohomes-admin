import api from "./axiosInstance";

/**
 * @typedef {Object} GetBuildersParams
 * @property {number} [page=1]
 * @property {number} [limit=10]
 * @property {string} [search] UI search term — sent to API as `name`
 * @property {string} [name] optional; same as search if passed explicitly
 */

/**
 * @typedef {Object} BuildersListResult
 * @property {Array} builders
 * @property {number} totalCount
 * @property {number} totalPages
 * @property {string} [message]
 */

/**
 * GET /api/admin/allbuilders
 * Response shape: { message, data: builders[], totalCount, totalPages? }
 *
 * @param {GetBuildersParams} params
 * @returns {Promise<BuildersListResult>}
 */
export const getBuilders = async (params = {}) => {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 10;

  const query = { page, limit };
  // Backend filters by builder name using query param `name` (not `search`).
  const nameTerm = params.name ?? params.search;
  if (nameTerm != null && String(nameTerm).trim() !== "") {
    query.name = String(nameTerm).trim();
  }

  const { data } = await api.get("/api/admin/allbuilders", { params: query });

  if (Array.isArray(data)) {
    return {
      builders: data,
      totalCount: data.length,
      totalPages: Math.max(1, Math.ceil(data.length / limit) || 1),
      message: "",
    };
  }

  const builders = Array.isArray(data?.data) ? data.data : [];
  const totalCount = Number(data?.totalCount) ?? builders.length;
  const totalPagesRaw =
    data?.totalPages != null
      ? Number(data.totalPages)
      : Math.ceil(totalCount / limit) || (totalCount > 0 ? 1 : 0);

  return {
    builders,
    totalCount,
    totalPages: Math.max(0, totalPagesRaw),
    message: data?.message ?? "",
  };
};

/**
 * Get builder by id
 */
export const getBuilderById = async (id) => {
  const { data } = await api.get(`/api/admin/builders/${id}`);
  return data;
};

/**
 * Delete builder
 */
export const deleteBuilderById = async (id) => {
  const { data } = await api.delete(`/api/admin/builder/delete/${id}`);
  return data;
};

export const createBuilder = async (payload) => {
  const { data } = await api.post("/api/admin/builder", payload);
  return data;
};

/**
 * Update builder
 */
export const updateBuilder = async (id, payload) => {
  const { data } = await api.put(`/api/admin/edit-builder/${id}`, payload);
  return data;
};
