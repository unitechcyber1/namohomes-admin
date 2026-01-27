import axios from "axios";
import BASE_URL from "../../apiConfig";

export const changeOrderOfProjects = async (data, id, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/newlaunch-projects/${id}`, data
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getTopProjectsByCity = async (params, cityId, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/dwarkaProject/newlaunch-order/${cityId}`, {params}
        );
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  export const changeOrderOfProjectsByDrag = async (data, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/update-newlaunch-projects`, data
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  