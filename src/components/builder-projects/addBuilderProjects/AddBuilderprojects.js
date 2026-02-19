import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import Mainpanelnav from "../../mainpanel-header/Mainpanelnav";
import "./AddBuilderProjects.css";
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
import { uploadFiles } from "services/mediaService";
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
    try {
      setLoading(true);
      setIsEditable(true);
      const data = await getProjectById(id, url);
      setEditProject(data);
    } catch (error) {
      toast({
        title: "Error Loading Project",
        description: error.message || "Failed to load project details. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleUploadFile = async (files) => {
    try {
      const data = await uploadFiles(files, {
        compressImages: true,
        onProgress: (percent) => {
          // Upload progress tracking
        },
      });
      if (data && data.length > 0) {
        setProjects((prev) => ({
          ...prev,
          master_plan: data[0],
        }));
        toast({
          title: "Upload Successful!",
          description: "Master plan uploaded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload master plan. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
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
      // Ensure location and plans objects exist when loading edit project
      const projectWithDefaults = {
        ...editProject,
        location: editProject.location || {
          address: "",
          country: "",
          state: "",
          city: "",
          micro_location: [],
          latitude: "",
          longitude: "",
          latitude2: "",
          longitude2: "",
          metro_detail: {
            name: "",
            is_near_metro: false,
          }
        },
        plans: editProject.plans || [],
        images: editProject.images || [],
        contact_details: editProject.contact_details || []
      };
      setProjects(projectWithDefaults);
    } else {
      setProjects({
        ...project,
        images: [],
        contact_details: [],
        plans: project.plans || []
      });
    }
  }, [editProject, isEditable]);
  const _setImagesForServer = () => {
    let images = []
    projects.images.forEach(item => {
      if (!item.image) {
        return
      }
      let obj = { ...item, image: item.image._id }
      images.push(obj)
    });
    return images;
  };
  const _setPlanImagesForServer = () => {
    return (projects?.plans || []).map(item => ({
      ...item,
      floor_plans: (item.floor_plans || []).map((plan) => ({
        ...plan,
        image: plan?.image?._id
      }))
    }));
  };
  const handleSaveAndUpdateProject = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!projects.name || !projects.slug) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name and Slug).",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const updatedProjectsData = { ...projects };
    updatedProjectsData.images = _setImagesForServer();
    updatedProjectsData.plans = _setPlanImagesForServer();
    updatedProjectsData.master_plan = updatedProjectsData.master_plan?._id;
    updatedProjectsData.brochure = updatedProjectsData.brochure?._id;
    updatedProjectsData.location_map = updatedProjectsData.location_map?._id;
    
    try {
      if (isEditable) {
        await updateProject(id, updatedProjectsData);
        toast({
          title: "Update Successful!",
          description: "Project has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        await createProject(updatedProjectsData);
        toast({
          title: "Save Successful!",
          description: "Project has been saved successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        // Reset form after successful creation
        setProjects({
          ...project,
          images: [],
          contact_details: []
        });
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message || "Failed to save project. Please check all required fields and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
    // Reset form to initial state
    if (isEditable) {
      setProjects({ ...editProject });
    } else {
      setProjects({
        ...project,
        images: [],
        contact_details: []
      });
    }
    toast({
      title: "Form Reset",
      description: "All changes have been discarded.",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
  useEffect(() => {
    if (url.includes('dwarkaexpressway')) {
      setCheckUrl(true);
    } else {
      setCheckUrl(false);
    }
  }, [url])
  if (loading && isEditable) {
    return <Loader />;
  }

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form
          style={{ textAlign: "left" }}
          onSubmit={handleSaveAndUpdateProject}
        >
          <div className="container">
            <ContactDetails />
            <ProjectDetails />
            <Location />
            <FloorPlans />
            <div className="project-card">
              <div className="row top-margin">
                <div className="col-md-12">
                  <h4 className="property_form_h4">Master Plan</h4>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-6">
                  <ImageUpload
                    images={images}
                    setImages={setImages}
                    progress={progress}
                    setProgress={setProgress}
                    uploadFile={handleUploadFile}
                    isUploaded={isUploaded}
                  />
                </div>
                <div className="col-md-6">
                  {(projects?.master_plan?.s3_link || projects.master_plan) && (
                    <div className="mt-3">
                      <img 
                        src={projects?.master_plan?.s3_link || projects.master_plan} 
                        alt="Master Plan Preview" 
                        style={{ 
                          width: "100%", 
                          maxWidth: "400px",
                          height: "auto",
                          borderRadius: "8px",
                          border: "1px solid #ddd"
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ProjectAmenities />
            <ProjectEditor />

            <ProjectImage />
            <ProjectSeo />
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              {isEditable ? "UPDATE" : "SAVE"}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBuilderprojects;
