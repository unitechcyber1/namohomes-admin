import React, { useState, useEffect, Fragment } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { GpState } from "../../../context/context";
import { uploadFiles } from "../../../services/mediaService";

const BuiderImage = () => {
  const [progress, setProgress] = useState(0);
  const { builderImage, setBuilderImage, editBuilder, isBuilderEditable } =
    GpState();
  const [isUploaded, setIsUploaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isBuilderEditable && editBuilder?.images?.length && !(builderImage?.length)) {
      setBuilderImage(editBuilder.images);
    }
  }, [isBuilderEditable, editBuilder?.images, builderImage?.length, setBuilderImage]);

  const removePreviewImage = (index) => {
    const updatedImages = [...(builderImage || [])];
    updatedImages.splice(index, 1);
    setBuilderImage(updatedImages);
  };

  const handleInputByClick = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const data = await uploadFiles(files, {
        compressImages: true,
        onProgress: (percent) => setProgress(percent),
      });

      if (!data || data.length === 0) {
        toast({
          title: "Upload failed",
          description: "Check your file format and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      const previewData = data.map((fileData, index) => ({
        image: fileData,
        name: files[index]?.name ?? "",
        alt: files[index]?.name ?? "",
      }));

      setBuilderImage((prev) => [...(prev || []), ...previewData]);
      setIsUploaded(true);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error?.response?.data?.message || error?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setProgress(0);
    }
  };

  const handleAltChange = (event, index) => {
    const value = event.target.value;
    setBuilderImage((prev) => {
      const arr = [...(prev || [])];
      if (arr[index]) arr[index] = { ...arr[index], alt: value };
      return arr;
    });
  };
  return (
    <>
      <div className="row mt-4">
        <h4 className="property_form_h4">Project Images</h4>
        <div className="container">
          <label className="file file_label">
            <FaUpload className="upload_icon" />
            <span className="upload_text">Upload</span>
            <input
              type="file"
              id="file-input"
              multiple
              accept="image/*"
              aria-label="File browser example"
              onChange={handleInputByClick}
              className="file_hide"
            />
          </label>

          {progress ? (
            <div>
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
            <h5>Uploaded</h5>
          ) : (
            ""
          )}
          <div id="preview" className="mt-3 d-flex align-items-center">
            <div
              className="table-box"
              style={{
                width: "100%",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              <h3>Images</h3>
              <TableContainer variant="striped" color="teal">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>No.</Th>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Alt</Th>

                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(builderImage || []).map((img, index) => (
                      <Fragment key={index}>
                        <Tr>
                          <Td>{index + 1}</Td>
                          <Td>
                            <img
                              src={img.image?.s3_link ?? img.image}
                              alt="media"
                              width="500px"
                              height="250px"
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control"
                              style={{ color: "#000" }}
                              value={img.name ?? ""}
                              readOnly
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              className="form-control"
                              style={{ color: "#000", minWidth: "200px" }}
                              value={(img.alt ?? "").split(".")[0]}
                              onChange={(event) =>
                                handleAltChange(event, index)
                              }
                            />
                          </Td>

                          <Td>
                            <AiFillDelete
                              onClick={() => removePreviewImage(index)}
                              className="icon"
                              style={{ color: "red" }}
                            />
                          </Td>
                        </Tr>
                      </Fragment>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuiderImage;
