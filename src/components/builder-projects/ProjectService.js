import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getStateByCountry = async (countryId, setStates) => {
  try {
    const result = await axios.get(
      `${BASE_URL}/api/admin/states/priority/${countryId}`,
      {
        country_id: countryId,
      }
    );
    setStates(result.data);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load states. Please try again.");
  }
};
export const getCityByState = async (stateId, setCities) => {
  try {
    await axios
      .post(`${BASE_URL}/api/admin/citybystate`, { state_id: stateId })
      .then((result) => { 
        setCities(result.data);
      });
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load cities. Please try again.");
  }
};

export const getMicrolocationByCity = async (cityId, setMicrolocations) => {
  try {
    await axios
      .get(`${BASE_URL}/api/admin/priority-location/${cityId}`)
      .then((result) => {
        setMicrolocations(result.data);
      });
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load microlocations. Please try again.");
  }
};

export const getCountry = async (setCountry) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/countries`);

    setCountry(data.country);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load countries. Please try again.");
  }
};

export const getBuilderData = async (setbuilders) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/builders`);
    setbuilders(data);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load builders. Please try again.");
  }
};
export const getAmenities = async (params) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/amenity`, {params});
    return data
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load amenities. Please try again.");
  }
};
export const getCategory = async (setCategories) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/propertyTypes`
    );

    setCategories(data);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load categories. Please try again.");
  }
};

export const getProjectData = async (params, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/projects-page`, {params}
      );
      return data;
    }
    if (!url.includes("dwarkaexpressway")) {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/projects-page`, {params}
      );
      return data;
    }
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load projects. Please try again.");
  }
};
export const searchedProjects = async (name, city, microlocation, status, page, limit) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/search-projects?name=${name}&city=${city}&microlocation=${microlocation}&status=${status}&page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to search projects. Please try again.");
  }
};
export const changeProjectStatus = async (
  id,
  action,
  url
) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      return await axios.put(
        `${BASE_URL}/api/admin/changeStatus/${id}`,
        { status: action }
      );
     } else {
       return await axios.put(
        `${BASE_URL}/api/admin/changeStatus/${id}`,
        { status: action }
      );
     }
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project status. Please try again.");
  }
};

export const deleteprojects = async (id, url) => {
  try {
      return await axios.delete(`${BASE_URL}/api/admin/delete/${id}`);
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to delete project. Please try again.");
  }
};
export const getProjectsById = async (id, url) => {
  try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/projects/${id}`
      );
      return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load project details. Please try again.");
  }
};

export const saveProjects = async (data) => {
  try {
    return await axios.post(`${BASE_URL}/api/admin/project`, data)
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to save project. Please check all fields and try again.");
  }
}
export const saveDwarkaProjects = async (data) => {
  try {
    return await axios.post(`${BASE_URL}/api/admin/dwarkaProject`, data)
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to save project. Please check all fields and try again.");
  }
}

export const updatedProjects = async (id, data) => {
  try {
    return await axios.put(`${BASE_URL}/api/admin/edit-project/${id}`, data)
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project. Please check all fields and try again.");
  }
}
export const updatedDwarkaProjects = async (id, data) => {
  try {
    return await axios.put(`${BASE_URL}/api/admin/edit-project/${id}`, data)
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to update project. Please check all fields and try again.");
  }
}

export const deleteImage = async (data, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
     return await axios.post(
        `${BASE_URL}/api/admin/file/delete`, data
      );
    } else {
      return await axios.post(
        `${BASE_URL}/api/admin/file/delete`, data
      );
    }
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to delete image. Please try again.");
  }
}
