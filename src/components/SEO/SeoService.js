import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getSeoDataById = async (
  id, url
) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      const { data } = await axios.get(`${BASE_URL}/api/admin/dwarka/seos/${id}`);
     return data;
   }else{
    const { data } = await axios.get(`${BASE_URL}/api/admin/seo/seos/${id}`);
    return data;
   }
  } catch (error) {
    console.log(error);
  }
};

export const getSeoData = async (setLoading, setSeos, url) => {
  try {
    if (url.includes("dwarkaexpressway")) {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/admin/dwarka/seos`);
     const newData = data.reverse();
     setSeos(newData);
     setLoading(false);
   }else{
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/admin/seo/seos`);
    const newData = data.reverse();
    setSeos(newData);
    setLoading(false);
   }
  } catch (error) {
    console.log(error);
  }
};
