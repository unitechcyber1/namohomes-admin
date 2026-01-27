import Cookies from "js-cookie";
import BASE_URL from "../apiConfig";
import axios from "axios";
import imageCompression from "browser-image-compression";

export const config = {
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
};

export const postConfig = {
  headers: {
    "Content-type": "application/json",

    Authorization: `Bearer ${Cookies.get("token")}`,
  },
};
export const uploadImageFile = async (files, options) => {
  const { setProgress, setIsUploaded, checkUrl } = options;
  
  try {
    const formData = new FormData();
    setProgress(0);
    
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
    
    const { data } = await axios.post(
      checkUrl ? `${BASE_URL}/api/admin/dwarkaProject/upload` : `${BASE_URL}/api/admin/project/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setProgress(parseInt((progressEvent.loaded * 100) / progressEvent.total));
        },
      }
    );
    
    setTimeout(() => {
      setProgress(0);
    }, 3000);
    
    setIsUploaded(true);
    
    return data;
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const uploadFile = async (
  files,
  setProgress,
  setIsUploaded,
  previewFile
) => {
  const formData = new FormData();
  setProgress(0);
  console.log(files)
  if(files[0].type === "video/mp4" || files[0].type === "video/webm" || files[0].type === "video/ogg"){
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
  }else{
    const options = {
      maxSizeMB: 0.8, // Maximum size in megabytes 1200*756
      maxWidthOrHeight: 1200, // Maximum width or height (whichever is larger)
    };
    const compressedFiles = await Promise.all(
      files.map((file) => imageCompression(file, options))
    );
    compressedFiles.forEach((file) => {
      formData.append("files", file, file.name);
    });
  }
  await axios
    .post(`${BASE_URL}/api/admin/dwarkaProject/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setProgress(
          parseInt((progressEvent.loaded * 100) / progressEvent.total)
        );
      },
    })
    .then((res) => {
      console.log(res.data)
      // previewFile(res.data);
      setTimeout(() => {
        setProgress(0);
      }, 3000);
      setIsUploaded(true);
    })
    .catch((err) => {
      console.log(err);
      console.log('yeah')
    });
};

