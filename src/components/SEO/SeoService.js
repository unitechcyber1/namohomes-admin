import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getSeoDataById = async (
  id, url
) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      const { data } = await axios.get(`${BASE_URL}/api/admin/seos/${id}`);
     return data;
   }else{
    const { data } = await axios.get(`${BASE_URL}/api/admin/seos/${id}`);
    return data;
   }
  } catch (error) {
    throw createUserFriendlyError(error, "Failed to load SEO data. Please try again.");
  }
};

export const getSeoData = async (setLoading, setSeos, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/admin/seos`);
     const newData = data.reverse();
     setSeos(newData);
     setLoading(false);
   }else{
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/admin/seos`);
    const newData = data.reverse();
    setSeos(newData);
    setLoading(false);
   }
  } catch (error) {
    setLoading(false);
    throw createUserFriendlyError(error, "Failed to load SEO data. Please try again.");
  }
};
