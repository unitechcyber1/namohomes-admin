import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const getMicrolocationWithPriority = async (
  setLoading,
  setPriorityMicrolocation,
  cityId
) => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      `${BASE_URL}/api/admin/microlocation/priority/${cityId}`
    );

    setPriorityMicrolocation(data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    throw createUserFriendlyError(error, "Failed to load microlocations. Please try again.");
  }
};

export const getMicrolocationByCity = async (
  cityId,
  setMicrolocations,
  setLoading
) => {
  try {
    setLoading(true);
    await axios
      .post(`${BASE_URL}/api/admin/microlocation/microbycity`, { city_id: cityId })
      .then((result) => {
        setMicrolocations(result.data);
        setLoading(false);
      });
  } catch (error) {
    setLoading(false);
    throw createUserFriendlyError(error, "Failed to load microlocations. Please try again.");
  }
};
