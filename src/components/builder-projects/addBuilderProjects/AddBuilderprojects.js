import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import Mainpanelnav from "../../mainpanel-header/Mainpanelnav";
import Location from "./Location";
import FloorPlans from "./FloorPlans";
import ProjectImage from "./ProjectImage";
import ProjectSeo from "./ProjectSeo";
import ProjectAmenities from "./ProjectAmenities";
import ProjectDetails from "./ProjectDetails";
import ProjectEditor from "./ProjectEditor";
import ContactDetails from "./ContactDetails";
import { GpState } from "../../../context/context";
import ImageUpload from "../../../ImageUpload";
import { uploadImageFile } from "../../../services/Services";
import { Link, useParams } from "react-router-dom";
import { getProjectById, createProject, updateProject } from "services/projectService";
import Loader from "../../loader/Loader";
import { project } from "../../../models/builderProjectModel";
function AddBuilderprojects() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkUrl, setCheckUrl] = useState(false)
  const { projects,
    selectedPlanId,
    setProjects,
    isEditable,
    setIsEditable, editProject, setEditProject } = GpState();
  const toast = useToast();
  const { id } = useParams();
  const url = window.location.href
  const handleFetchDatabyId = async () => {
    setLoading(true);
    setIsEditable(true);
    const data = await getProjectById(id, url);
    setEditProject(data);
    setLoading(false);
  };
  const handleUploadFile = async (files) => {
    const data = await uploadImageFile(files, {setProgress: () => {}, setIsUploaded: () => {}, checkUrl});
    setProjects((prev) => ({
      ...prev,
      master_plan: data[0]
    }))
  };
  useEffect(() => {
    if (id) {
      handleFetchDatabyId();
    } else {
      setEditProject({});
      setIsEditable(false);
    }
  }, [id]);
  useEffect(() => {
    if (editProject && isEditable) {
      setProjects({ ...editProject })
    }
    else {
      setProjects({
        ...project,
        images: [],
        contact_details: []
      });
    }
  }, [editProject]);
  const _setImagesForServer = () => {
    let images = []
    projects.images.forEach(item => {
     if(!item.image){
        return
     }
     let obj = {...item, image: item.image._id}
     images.push(obj)
    });
    return images;
  };
  const _setPlanImagesForServer = () => {
    return projects.plans.map(item => ({
      ...item,
      floor_plans: item.floor_plans.map((plan) => ({
        ...plan,
        image: plan?.image?._id
      }))
    }));
  };
  const handleSaveAndUpdateProject = async (e) => {
    e.preventDefault();
    const updatedProjectsData = {...projects};
    updatedProjectsData.images = _setImagesForServer();
    updatedProjectsData.plans = _setPlanImagesForServer()
    updatedProjectsData.master_plan = updatedProjectsData.master_plan?._id
    updatedProjectsData.brochure = updatedProjectsData.brochure?._id
    updatedProjectsData.location_map = updatedProjectsData.location_map?._id
    try {
      if (isEditable) {
          await updateProject(id, updatedProjectsData)
      } else {
          await createProject(updatedProjectsData)
      }
      toast({
        title: isEditable ? "Update Successfully!" : "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Saved the Space",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleCancel = (e) => {
    e.preventDefault()
    toast({
      title: "Cancel",
      description: "Canceled the Space",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
  useEffect(() => {
    if (url.includes('dwarkaexpressway')) {
      setCheckUrl(true)
    } else {
      setCheckUrl(false)
    }
  }, [checkUrl])
  if (loading && isEditable) {
    return <Loader />;
  }

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form
          style={{ textAlign: "left" }}
          // onSubmit={handleSaveAndUpdateProject}
        >
          <div className="container">
            <ContactDetails />
            <ProjectDetails />
            <Location />
            <FloorPlans />
            <div className="project-card">
            <div className="d-flex justify-content-between col-10">
              <div className="row-md-12">
                <h4 className="property_form_h4">Master Plan</h4>
              </div>
              <div className="row-md-6">
                <ImageUpload
                  images={images}
                  setImages={setImages}
                  progress={progress}
                  setProgress={setProgress}
                  uploadFile={handleUploadFile}
                  isUploaded={isUploaded}
                />
              </div>
              {(projects?.master_plan?.s3_link || projects.master_plan) && <img src={projects?.master_plan?.s3_link} style={{ width: "25%" }} />}
            </div>
          </div>
            <ProjectAmenities />
            <ProjectEditor />

            <ProjectImage />
            <ProjectSeo />
          </div>
          <div className="form-footer">
            <button onClick={handleSaveAndUpdateProject} type="submit" className="saveproperty-btn">
              {isEditable ? "UPDATE" : "SAVE"}
            </button>
            <button onClick={handleCancel} className="cancel-btn">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBuilderprojects;
