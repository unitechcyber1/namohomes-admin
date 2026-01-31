import BASE_URL from "../../apiConfig";
import axios from "axios";

export const getPropertyTypes = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/propertyTypes`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };
export const getProjectsDataByPlanAndCity = async (plansId, city) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/projects-by-plans/${plansId}/${city}`
      );
  
     return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getTopProjectsByPlanType = async (plansId, city, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/dwarkaProject/plans-projects/${plansId}/${city}`
        );
        return data;
      }
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/project/plans-projects/${plansId}/${city}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const changePlanOrderOfProjectsByDrag = async (data, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return  await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/plans-priority`,
          data
        );
      }
      return await axios.put(
        `${BASE_URL}/api/admin/project/plans-priority`,
        data
      );
    } catch (error) {
      console.log(error);
    }
  };

  export const changePlanOrderOfProjects = async (data, id, url) => {
    try {
      if (url.includes("dwarkaexpressway")) {
        return await axios.put(
          `${BASE_URL}/api/admin/dwarkaProject/plans-order/${id}`, data
        );
      }
      return await axios.put(
        `${BASE_URL}/api/admin/project/plans-order/${id}`, data
      );
    } catch (error) {
      console.log(error);
    }
  };