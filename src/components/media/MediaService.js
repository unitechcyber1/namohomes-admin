import BASE_URL from "../../apiConfig";
import axios from "axios";

export const saveImage = async (data) => {
    try {
     return await axios.post(
        `${BASE_URL}/api/admin/media/upload`,
        data
      );
    } catch (error) {
      console.log(error)
    }
  };

  export const allImages = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/media/images`);
      return data.data
    } catch (error) {
      console.log(error);
    }
  };