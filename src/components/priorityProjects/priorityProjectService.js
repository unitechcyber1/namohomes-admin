import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getProjectsDataByMicrolocation = async (
  id
) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/projects-by-location/${id}`
    );
    return data;
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load projects. Please try again.");
  }
};

export const getProjectsByMicrolocationWithPriority = async (
id
) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/priority-projects/${id}`
    );
    return data;

  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load priority projects. Please try again.");
  }
};
