import api from "./axiosInstance";
import imageCompression from "browser-image-compression";

/**
 * Save media image
 */
export const createMedia = async (payload) => {
  try {
    const { data } = await api.post(
      "/api/admin/media/upload",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all media images
 */
export const getAllMedia = async () => {
  try {
    const { data } = await api.get(
      "/api/admin/media/images"
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete media image
 */
export const deleteMediaById = async (id) => {
  try {
    const { data } = await api.delete(
      `/api/admin/image/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadFiles = async (
  files,
  {
    compressImages = true,
    onProgress = null,
  } = {}
) => {
  try {
    const formData = new FormData();

    const processedFiles = await processFiles(files, compressImages);

    processedFiles.forEach((file) => {
      formData.append("files", file, file.name);
    });

    const { data } = await api.post(
      "/api/admin/dwarkaProject/upload", // ✅ Only one endpoint now
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (onProgress) {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            onProgress(percent);
          }
        },
      }
    );

    return data;

  } catch (error) {
    throw error?.response?.data || error;
  }
};

/* ---------------------------------- */
/*       FILE PROCESSING LAYER       */
/* ---------------------------------- */

const processFiles = async (files, compressImages) => {

  const isVideo = (file) =>
    ["video/mp4", "video/webm", "video/ogg"].includes(file.type);

  const compressionOptions = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1200,
  };

  return Promise.all(
    files.map(async (file) => {
      if (!compressImages || isVideo(file)) {
        return file;
      }
      return await imageCompression(file, compressionOptions);
    })
  );
};