import api from "./axiosInstance";

/* ---------- LOCATION ---------- */

export const getCountries = async () => {
  const { data } = await api.get("/api/admin/countries");
  return data.country;
};

export const getStatesByCountry = async (countryId) => {
  const { data } = await api.get(
    `/api/admin/states/priority/${countryId}`
  );
  return data;
};

export const getCitiesByState = async (stateId) => {
  const { data } = await api.post(
    "/api/admin/citybystate",
    { state_id: stateId }
  );
  return data;
};

export const getMicrolocationsByCity = async (cityId) => {
  const { data } = await api.get(
    `/api/admin/priority-location/${cityId}`
  );
  return data;
};

/* ---------- META ---------- */

export const getBuilders = async () => {
  const { data } = await api.get("/api/admin/builders");
  return data;
};

export const getAmenities = async (params = {}) => {
  const { data } = await api.get("/api/admin/amenity", { params });
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/api/admin/propertyTypes");
  return data;
};

/* ---------- PROJECTS ---------- */

export const getProjects = async (params = {}) => {
  const { data } = await api.get("/api/admin/projects-page", { params });
  return data;
};

export const searchProjects = async (params = {}) => {
  const { data } = await api.get("/api/admin/search-projects", { params });
  return data;
};

export const getProjectById = async (id) => {
  const { data } = await api.get(`/api/admin/projects/${id}`);
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/api/admin/project", payload);
  return data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(
    `/api/admin/edit-project/${id}`,
    payload
  );
  return data;
};

export const changeProjectStatus = async (id, status) => {
  const { data } = await api.put(
    `/api/admin/changeStatus/${id}`,
    { status }
  );
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/api/admin/delete/${id}`);
  return data;
};

/* ---------- FILES ---------- */

export const deleteImage = async (payload) => {
  const { data } = await api.post(
    "/api/admin/file/delete",
    payload
  );
  return data;
};
