import React, { useState, Fragment, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AiFillDelete } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
const ImageUpload = ({
  images,
  setImages,
  progress,
  setProgress,
  uploadFile,
  isUploaded,
}) => {
  const [fileName, setFileName] = useState([]);
  const removePreviewImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    uploadFile(Array.from(files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleInputByClick = (e) => {
    const files = Array.from(e.target.files);
    uploadFile(files);
    const fileNames = files.map((file) => file.name);
    setFileName(fileNames);
  };

  return (
    <div className="App">
      <div className="container">
        <div
          id="drop-region-container"
          className="drop-region-container mx-auto img-drop-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div id="drop-region" className="drop-region text-center">
            <div
              className="d-flex align-items-flex-end"
              style={{ height: "25px" }}
            >
              <label className="file">
              <span className="upload_text">Upload</span>
                  <FaUpload className="upload_icon" />
                <input
                  type="file"
                  id="file-input"
                  aria-label="File browser example"
                  onChange={handleInputByClick}
                  className="file_hide"
                />
              </label>
            </div>
          </div>
        </div>

        {progress ? (
          <div style={{ marginTop: "40px" }}>
            <p className="mx-auto">
              <strong>Uploading Progress</strong>
            </p>
            <div className="progress mx-auto">
              <div
                id="progress-bar"
                className="progress-bar progress-bar-striped bg-info"
                role="progressbar"
                aria-valuenow="40"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        ) : isUploaded ? (
          <h5 style={{ marginTop: "50px" }}>Uploaded</h5>
        ) : (
          ""
        )}

        <div id="preview" className="mt-3 d-flex align-items-center">
          {images?.map((img, index) => (
            <Fragment key={index}>
              <img src={img} alt="media" width="50%" />
              <div className="w-50 text-center">
                <AiFillDelete
                  onClick={removePreviewImage}
                  className="icon"
                  style={{ color: "red" }}
                />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
