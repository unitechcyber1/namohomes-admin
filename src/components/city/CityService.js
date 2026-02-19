import axios from "axios";
import BASE_URL from "../../apiConfig";
import { getErrorMessage } from "../../utils/errorHandler";

export const getCity = async (setCities, setLoading) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/admin/cities`);
    setLoading(false);
    setCities(data);
  } catch (error) {
    setLoading(false);
    throw new Error(getErrorMessage(error));
  }
};

export const deleteCity = async (id, setUpdateTable, toast) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/api/admin/city/delete/${id}`);
    setUpdateTable((prev) => !prev);
    toast({
      title: "Deleted Successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: getErrorMessage(error),
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
