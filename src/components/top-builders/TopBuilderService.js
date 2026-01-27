import axios from "axios";
import BASE_URL from "../../apiConfig";

export const changeOrderOfBuilder = async (data, id) => {
    try {
        return await axios.put(
          `${BASE_URL}/api/admin/builder/update-order/${id}`, data
          );
    } catch (error) {
      console.log(error);
    }
  };
  export const changeOrderOfBuildersByDrag = async (data) => {
    try {
        return await axios.put(
          `${BASE_URL}/api/admin/builder/change-order`,
          data
        );
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getTopBuilders = async () => {
    try {
        const { data } = await axios.get(
          `${BASE_URL}/api/admin/builder/top-builders`
        );
        return data;
    } catch (error) {
      console.log(error);
    }
  };