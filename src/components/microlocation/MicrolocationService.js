import axios from "axios";
import BASE_URL from "../../apiConfig";

export const getStateByCountry = async (countryId, setStates) => {
  try {
    const result = await axios.post(`${BASE_URL}/api/admin/statesbycountry`, {
      country_id: countryId,
    });
    setStates(result.data);
  } catch (error) {
    console.log(error.message);
  }
};
export const getCityByState = async (stateId, setCities) => {
  try {
    await axios
      .post(`${BASE_URL}/api/admin/citybystate`, { state_id: stateId })
      .then((result) => {
        setCities(result.data);
      });
  } catch (error) {
    console.log(error);
  }
};

export const getCountry = async (setCountry) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admin/countries`);

    setCountry(data.country);
  } catch (error) {
    console.log(error);
  }
};

export const getMicroLocation = async (setMicrolocations, setLoading) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/locations`
    );
    const newData = data.reverse();

    setMicrolocations(newData);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const deleteMicrolocations = async (id, setUpdateTable, toast) => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/api/admin/microlocation/delete/${id}`
    );
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
