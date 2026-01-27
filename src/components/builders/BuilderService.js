import axios from "axios";

import BASE_URL from "../../apiConfig";

export const getbuildersData = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/builder/builders`);
    return data
  } catch (error) {
    console.log(error);
  }
};
export const getAllbuildersData = async (params, url) => {
  try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/builder/allbuilders`, {params}
      );
      return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCity = async (setAllCity) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/city/cities`);
    setAllCity(data);
  } catch (error) {
    console.log(error);
  }
};

export const getbuildersDataById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/builder/builders/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteBuildersById = async (id) => {
  try {
    return await axios.delete(`${BASE_URL}/api/admin/builder/delete/${id}`);
  } catch (error) {
    console.log(error);
  }
};

