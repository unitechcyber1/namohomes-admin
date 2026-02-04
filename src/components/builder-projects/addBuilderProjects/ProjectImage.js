import React, { useState, useEffect, Fragment } from "react";
import { uploadImageFile, uploadPdfFile } from "../../../services/Services";
import { FaUpload } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { GpState } from "../../../context/context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Delete from "../../delete/Delete";
import { deleteImage } from "services/projectService";
import { useToast } from "@chakra-ui/react";
const ProjectImage = () => {
  const [progress, setProgress] = useState(0);
  const { projects, setProjects } = GpState();
  const [isUploaded, setIsUploaded] = useState(false);
  const [checkUrl, setCheckUrl] = useState(false)
  const toast = useToast();
  const route = window.location.href
   const handleInputByClick =async  (e) => {
     const files = Array.from(e.target.files);
   const data = await uploadImageFile(files, {setProgress, setIsUploaded, checkUrl});
   if(!data){
    toast({
      title: "Error Occured!",
      description: "Check your file extension",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
    return
  }
   const lastOrder = projects.images.length > 0 ? projects.images[projects.images.length - 1].order : 0;
     const previewData = data?.map((url, index) => ({
       image: url,
       name: files[index].name,
       alt: files[index].name,
       order: lastOrder + index + 1,  
     }));
      setProjects((prevProjects) => ({
        ...prevProjects,
        images: [...prevProjects.images, ...previewData],
      }));
   };
  const handleUploadPdf = async (e) => {
    const files = Array.from(e.target.files);
   const data  = await uploadImageFile(files,  {setProgress: () => {}, setIsUploaded: () => {}, checkUrl});
   setProjects((prev) => ({
    ...prev, 
    brochure: data[0]
   }))
  };
  const handleUploadMap = async (e) => {
    const files = Array.from(e.target.files);
   const data  = await uploadImageFile(files, {setProgress: () => {}, setIsUploaded: () => {}, checkUrl});
   setProjects((prev) => ({
    ...prev, 
    location_map: data[0]
   }))
  };
  const handleAltChange = (event, order) => {
     const {name, value} = event.target;
     setProjects((prev) => ({
      ...prev,
      images: prev.images.map((img) => {
        if(img.order === order){
          return { ...img, [name]: value };
        }
        return img
      })
     })) 
  };
  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const recordedimage = Array.from(projects.images);
    const [movedSpace] = recordedimage.splice(source.index, 1);
    recordedimage.splice(destination.index, 0, movedSpace);
    const updatedOrderPayload = recordedimage.map((image, index) => ({
      _id: image._id,
       order: index + 1,
       image: image.image,
       alt: image.alt,
       name: image.name
    }));
    setProjects((prev) => ({
      ...prev,
      images: [...updatedOrderPayload]
    }))
    };
    const handleDelete = async (imageId, order, name, id) => {
      const data = { projectId: projects?._id, imageId, name, id}
      try {
       await deleteImage(data, route)
        setProjects((prevProjects) => ({
          ...prevProjects,
          images: prevProjects.images.filter((image) => image.order !== order),
        }));
      } catch (error) {
        console.error('Error deleting image:', error.message);
      }
    };
    useEffect(() => {
        if(route.includes('dwarkaexpressway')){
   setCheckUrl(true)
  }else{
    setCheckUrl(false)
  }
    },[checkUrl])
    return (
      <>
        <div className="row top-margin image-border">
          <h4 className="property_form_h4">Project Images</h4>
          <div className="container">
         
            <label className="file file_label">
            <FaUpload className="upload_icon" />
             <span className="upload_text">Upload</span>
              <input
                type="file"
                id="file-input"
                multiple
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
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="images">
                        {(provided) => (
                          <Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {projects.images.map((img, index) => (
                              <Draggable
                                key={index}
                                draggableId={index.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <Tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <Td {...provided.dragHandleProps}>
                                      {index + 1}
                                    </Td>
                                    <Td {...provided.dragHandleProps}>
                                      <img
                                        src={img.image?.s3_link || img.image}
                                        alt="media"
                                        width="500px"
                                        height="250px"
                                      />
                                    </Td>
                                    <Td {...provided.dragHandleProps}>
                                      <input
                                        type="text"
                                        className="form-control"
                                        style={{ color: "#000" }}
                                        value={img.name}  
                                        name="name"
                                        onChange={(event) =>
                                          handleAltChange(event, img.order)
                                        }
                                      />
                                    </Td>
                                    <Td {...provided.dragHandleProps}>
                                      <input
                                        type="text"
                                        className="form-control"
                                        style={{
                                          color: "#000",
                                          minWidth: "200px",
                                        }}
                                        name="alt"
                                        value={img.alt?.split(".")[0]}
                                        onChange={(event) =>
                                          handleAltChange(event, img.order)
                                        }
                                      />
                                    </Td>
                                    <Td>
                                      <Delete
                                        handleFunction={() =>
                                          handleDelete(img._id, img.order, img?.image?.name, img.image?._id)
                                        }
                                      />
                                    </Td>
                                  </Tr>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <h4 className="property_form_h4">Upload Brochure</h4>
          <label className="file file_label">
          <FaUpload className="upload_icon" />
            <span className="upload_text">Upload</span>
          <input type="file" accept=".pdf" onChange={handleUploadPdf} className="file_hide"/>
          </label>
          {(projects?.brochure || projects?.brochure?.s3_link) && (
            <a href={projects?.brochure?.s3_link} download>
              Download {projects?.name} Brochure
            </a>
          )}
        </div>
        <div className="row mt-5">
          <h4 className="property_form_h4">Upload Location Map</h4>
          <label className="file file_label">
          <FaUpload className="upload_icon" />
            <span className="upload_text">Upload</span>
          <input type="file" onChange={handleUploadMap} className="file_hide"/>
          </label>
          {(projects.location_map || projects.location_map?.s3_link) && <Fragment>
                      <img src={projects.location_map?.s3_link} alt="media" style={{ width: "25%" }} />
                    </Fragment>}
        </div>
      </>
    );
};

export default ProjectImage;
