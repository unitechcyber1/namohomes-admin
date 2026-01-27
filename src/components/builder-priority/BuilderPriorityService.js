import BASE_URL from "../../apiConfig";
import axios from "axios";
export const getProjectsDataByBuilder = async (builderId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/projects-by-builder/${builderId}`
      );
  
     return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getTopProjectsByBuilder = async (builderId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/builder-projects/${builderId}`
      );
  return data;
    } catch (error) {
      console.log(error);
    }
  };
  