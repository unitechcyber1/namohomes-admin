import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getState = async (setStates, setLoading) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/api/admin/state/states`);
    setLoading(false);
    setStates(data);
  } catch (error) {
    console.log(error);
  }
};
export const deleteStates = async (id, setUpdateTable, toast) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/api/admin/state/delete/${id}`);
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
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
