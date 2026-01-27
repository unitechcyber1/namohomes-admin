import axios from "axios";
import BASE_URL from "../../apiConfig";
export const deleteAmenity = async (id) => {
    try {
        return await axios.delete(
            `${BASE_URL}/api/admin/amenity/delete/${id}`
        );
    } catch (error) {
        console.error('Error deleting amenity:', error.message);
    }
}

export const getallAmenities = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/admin/amenity/amenities`);
        return data
    } catch (error) {
        console.log(error);
    }
};
export const getAmenityById = async (id) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/admin/amenity/${id}`);
        return data
    } catch (error) {
        console.log(error);
    }
};
export const saveAmenities = async (data) => {
    try {
        return await axios.post(`${BASE_URL}/api/admin/amenity/amenities`, data);
    } catch (error) {
        console.log(error);
    }
};
export const editAmenities = async (id, data) => {
    try {
        return await axios.put(`${BASE_URL}/api/admin/amenity/amenity-by-id/${id}`, data);
    } catch (error) {
        console.log(error);
    }
};
