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

/**
 * Normalize upload API response to a flat array of file/media objects.
 * Backends may return an array, { data: [...] }, { files: [...] }, or a single object.
 */
export const normalizeUploadResponse = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const tryArray = (v) => (Array.isArray(v) ? v : null);

  const nested =
    tryArray(payload.data) ||
    tryArray(payload.files) ||
    tryArray(payload.result) ||
    tryArray(payload.items) ||
    tryArray(payload.uploads) ||
    tryArray(payload.media) ||
    tryArray(payload.images);

  if (nested) return nested;

  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    const d = payload.data;
    const inner =
      tryArray(d.files) ||
      tryArray(d.data) ||
      tryArray(d.media) ||
      tryArray(d.images);
    if (inner) return inner;
    if (d._id || d.s3_link || d.url || d.path) return [d];
  }

  if (payload.file && typeof payload.file === "object") {
    return [payload.file];
  }

  if (payload._id || payload.s3_link || payload.url || payload.path) {
    return [payload];
  }

  return [];
};

const getErrorMessage = (error) => {
  if (!error) return "Upload failed. Please try again.";
  if (typeof error === "string") return error;
  if (error.message && typeof error.message === "string") return error.message;
  const d = error.response?.data ?? error;
  if (typeof d === "string") return d;
  if (d?.message) return Array.isArray(d.message) ? d.message.join(", ") : String(d.message);
  if (d?.error) return String(d.error);
  return "Upload failed. Please try again.";
};

export const uploadFiles = async (
  files,
  {
    compressImages = true,
    onProgress = null,
  } = {}
) => {
  const formData = new FormData();

  const processedFiles = await processFiles(files, compressImages);

  processedFiles.forEach((file) => {
    formData.append("files", file, file.name);
  });

  try {
    const { data } = await api.post("/api/admin/upload", formData, {
      timeout: 120000,
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });

    const list = normalizeUploadResponse(data);
    if (!list.length) {
      throw new Error("Server returned no files. Check the upload response format.");
    }
    return list;
  } catch (error) {
    throw new Error(getErrorMessage(error));
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
      try {
        return await imageCompression(file, compressionOptions);
      } catch {
        // Compression can fail on some formats; use original file
        return file;
      }
    })
  );
};