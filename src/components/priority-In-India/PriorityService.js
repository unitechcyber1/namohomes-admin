import axios from "axios";
import BASE_URL from "../../apiConfig";



export const getTopProjectsIndia = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/project-india`
    );
   return data;
  } catch (error) {
    console.log(error);
  }
};
