import api from "./axiosInstance";

/* ---------- HELPERS ---------- */

const cleanParams = (params) => {
  const cleaned = { ...params };
  Object.keys(cleaned).forEach((key) => {
    const val = cleaned[key];
    if (val === "" || val == null) {
      delete cleaned[key];
    } else if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") {
        delete cleaned[key];
      } else {
        cleaned[key] = trimmed;
      }
    }
  });
  return cleaned;
};

const toApiParams = (params) => cleanParams(params);

const toSearchParams = (params) => {
  const cleaned = cleanParams(params);
  const searchParams = { ...cleaned };
  if (cleaned.location) {
    searchParams.microlocation = cleaned.location;
    delete searchParams.location;
  }
  return searchParams;
};

const parseProjectsResponse = (data) => {
  const projects = data?.projects ?? data?.data ?? [];
  const totalCount =
    data?.totalCount ?? data?.total_count ?? data?.total ?? projects.length;
  return { projects: Array.isArray(projects) ? projects : [], totalCount };
};

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
  const apiParams = toApiParams(params);
  const { data } = await api.get("/api/admin/projects-page", {
    params: apiParams,
  });
  return parseProjectsResponse(data);
};

export const searchProjects = async (params = {}) => {
  const apiParams = toSearchParams(params);
  const { data } = await api.get("/api/admin/search-projects", {
    params: apiParams,
  });
  return parseProjectsResponse(data);
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
