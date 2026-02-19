import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";



export const getTopProjectsIndia = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/project-india`
    );
   return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load projects. Please try again.");
  }
};
