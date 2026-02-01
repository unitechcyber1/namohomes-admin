import axios from "axios";
import BASE_URL from "../../apiConfig";
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
    console.log(error.message);
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
    console.log(error);
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
    console.log(error);
  }
};

export const getCountry = async (setCountry) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/countries`);

    setCountry(data.country);
  } catch (error) {
    console.log(error);
  }
};

export const getBuilderData = async (setbuilders) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/builders`);
    setbuilders(data);
  } catch (error) {
    console.log(error);
  }
};
export const getAmenities = async (params) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/amenity`, {params});
    return data
  } catch (error) {
    console.log(error);
  }
};
export const getCategory = async (setCategories) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/propertyTypes`
    );

    setCategories(data);
  } catch (error) {
    console.log(error);
  }
};

// export const getProjectData = async (page, limit) => {
//   try {
//     const { data } = await axios.get(`${BASE_URL}/api/admin/project/projects-page/?page=${page}&limit=${limit}`);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };
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
    console.log(error);
  }
};
export const searchedProjects = async (name, city, microlocation, status, page, limit) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/search-projects?name=${name}&city=${city}&microlocation=${microlocation}&status=${status}&page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.log(error);
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
    console.log(error)
  }
};

export const deleteprojects = async (id, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
     return await axios.delete(`${BASE_URL}/api/admin/delete/${id}`);
    } else {
      return await axios.delete(`${BASE_URL}/api/admin/delete/${id}`);
    }
  } catch (error) {
    console.log(error)
  }
};
export const getProjectsById = async (id, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/projects/${id}`
      );
      return data;
    } else {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/projects/${id}`
      );
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveProjects = async (data) => {
  try {
    return await axios.post(`${BASE_URL}/api/admin/project`, data)
  } catch (error) {
    console.log(error);
  }
}
export const saveDwarkaProjects = async (data) => {
  try {
    return await axios.post(`${BASE_URL}/api/admin/dwarkaProject`, data)
  } catch (error) {
    console.log(error);
  }
}

export const updatedProjects = async (id, data) => {
  try {
    return await axios.put(`${BASE_URL}/api/admin/edit-project/${id}`, data)
  } catch (error) {
    console.log(error);
  }
}
export const updatedDwarkaProjects = async (id, data) => {
  try {
    return await axios.put(`${BASE_URL}/api/admin/edit-project/${id}`, data)
  } catch (error) {
    console.log(error);
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
    console.error('Error deleting image:', error.message);
  }
}
