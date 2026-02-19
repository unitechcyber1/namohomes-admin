import axios from "axios";
import BASE_URL from "../../apiConfig";
import { createUserFriendlyError } from "../../utils/errorHandler";

export const deleteAmenity = async (id) => {
    try {
        return await axios.delete(
            `${BASE_URL}/api/admin/amenity/delete/${id}`
        );
    } catch (error) {
        throw createUserFriendlyError(error, "Failed to delete amenity. Please try again.");
    }
}

export const getallAmenities = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/admin/amenity`);
        return data
    } catch (error) {
        throw createUserFriendlyError(error, "Failed to load amenities. Please try again.");
    }
};
export const getAmenityById = async (id) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/admin/amenity/${id}`);
        return data
    } catch (error) {
        throw createUserFriendlyError(error, "Failed to load amenity details. Please try again.");
    }
};
export const saveAmenities = async (data) => {
    try {
        return await axios.post(`${BASE_URL}/api/admin/amenities`, data);
    } catch (error) {
        throw createUserFriendlyError(error, "Failed to save amenity. Please check all fields and try again.");
    }
};
export const editAmenities = async (id, data) => {
    try {
        return await axios.put(`${BASE_URL}/api/admin/amenity-by-id/${id}`, data);
    } catch (error) {
        throw createUserFriendlyError(error, "Failed to update amenity. Please check all fields and try again.");
    }
};
