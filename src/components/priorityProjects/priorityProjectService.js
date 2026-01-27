import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getProjectsDataByMicrolocation = async (
  id
) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/project/projects-by-location/${id}`
    );
    return data;
    console.log(data)
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};
