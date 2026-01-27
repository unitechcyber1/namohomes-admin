import axios from "axios";
import BASE_URL from "../../apiConfig";


export const saveUrls = async (data) => {
    try {
      return await axios.post(`${BASE_URL}/api/admin/url/create`, data)
    } catch (error) {
      console.log(error);
    }
  }
  
  export const updatedUrls = async (id, data) => {
    try {
      return await axios.put(`${BASE_URL}/api/admin/url/update/${id}`, data)
    } catch (error) {
      console.log(error);
    }
  }

  export const getUrlById = async (id) => {
    try {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/url/${id}`
        );
        return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  export const getProjectData = async (params, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/dwarkaProject/projects-page`, {params}
        );
        return data;
      }
      if (!url.includes("dwarkaexpressway")) {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/project/projects-page`, {params}
        );
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  export const getAllUrls = async (params) => {
    try {
        const { data } = await axios.get(
            `${BASE_URL}/api/admin/url/allurls`, {params}
          );
          return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const changeUrlStatus = async (
    id,
    action,
    url
  ) => {
    try {
        return await axios.put(
          `${BASE_URL}/api/admin/url/update-status/${id}`,
          { status: action }
        );
  
    } catch (error) {
      console.log(error)
    }
  };

  export const deleteUrls = async (id) => {
    try {
        return await axios.delete(`${BASE_URL}/api/admin/url/delete/${id}`);
    } catch (error) {
      console.log(error)
    }
  };