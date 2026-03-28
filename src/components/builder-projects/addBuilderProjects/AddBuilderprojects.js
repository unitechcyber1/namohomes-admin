import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import "./AddBuilderProjects.css";
import Location from "./Location";
import FloorPlans from "./FloorPlans";
import ProjectImage from "./ProjectImage";
import ProjectSeo from "./ProjectSeo";
import ProjectAmenities from "./ProjectAmenities";
import ProjectDetails from "./ProjectDetails";
import ProjectEditor from "./ProjectEditor";
import { GpState } from "../../../context/context";
import ImageUpload from "../../../ImageUpload";
import { uploadImageFile } from "../../../services/Services";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProjectById, createProject, updateProject } from "../../../services/projectService";
import Loader from "../../loader/Loader";
import { project } from "../../../models/builderProjectModel";
import { uploadFiles } from "../../../services/mediaService";

/** Match Project details select values; API may return different casing. */
const normalizeProjectType = (t) => {
  const s = String(t ?? "").trim().toLowerCase();
  return s === "commercial" ? "commercial" : "residential";
};

const mapAmenityEntryToId = (item) => {
  if (item == null || item === false) return null;
  if (typeof item === "string" || typeof item === "number") return String(item);
  if (item._id != null) return String(item._id);
  if (item.id != null) return String(item.id);
  return null;
};

const mapAmenityIdList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(mapAmenityEntryToId).filter(Boolean);
};

/** API may use allAmenities / all_amenities or populated amenity objects. */
const normalizeAllAmenitiesFromApi = (raw) => {
  if (!raw || typeof raw !== "object") {
    return { residential: [], commercial: [] };
  }
  return {
    residential: mapAmenityIdList(
      raw.residential ?? raw.residential_amenities
    ),
    commercial: mapAmenityIdList(raw.commercial ?? raw.commercial_amenities),
  };
};

function AddBuilderprojects() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { projects,
    selectedPlanId,
    setProjects,
    isEditable,
    setIsEditable, editProject, setEditProject } = GpState();
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const handleFetchDatabyId = async () => {
    try {
      setLoading(true);
      setIsEditable(true);
      const data = await getProjectById(id);
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
        project_type: normalizeProjectType(editProject.project_type),
        allAmenities: normalizeAllAmenitiesFromApi(
          editProject.allAmenities ?? editProject.all_amenities
        ),
        location: {
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
            distance: "",
          },
          school_detail: {
            name: "",
            is_near_school: false,
            distance: "",
          },
          college_detail: {
            name: "",
            is_near_college: false,
            distance: "",
          },
          market_detail: {
            name: "",
            is_near_market: false,
            distance: "",
          },
          hospital_detail: {
            name: "",
            is_near_hospital: false,
            distance: "",
          },
          ...(editProject.location || {}),
          metro_detail: {
            name: "",
            is_near_metro: false,
            distance: "",
            ...(editProject.location?.metro_detail || {}),
          },
          school_detail: {
            name: "",
            is_near_school: false,
            distance: "",
            ...(editProject.location?.school_detail || {}),
          },
          college_detail: {
            name: "",
            is_near_college: false,
            distance: "",
            ...(editProject.location?.college_detail || {}),
          },
          market_detail: {
            name: "",
            is_near_market: false,
            distance: "",
            ...(editProject.location?.market_detail || {}),
          },
          hospital_detail: {
            name: "",
            is_near_hospital: false,
            distance: "",
            ...(editProject.location?.hospital_detail || {}),
          },
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
    setSubmitAttempted(true);

    // Basic validation
    if (!projects || !projects.name || !projects.slug) {
      setFormErrors({
        name: !projects?.name ? "Project name is required." : "",
        slug: !projects?.slug ? "Slug is required." : "",
      });
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
    setFormErrors({});

    let updatedProjectsData;
    try {
      updatedProjectsData = { ...projects };
      updatedProjectsData.images = _setImagesForServer();
      updatedProjectsData.plans = _setPlanImagesForServer();

      // Normalize master_plan / brochure / location_map to IDs or URLs if objects are present.
      if (updatedProjectsData.master_plan && typeof updatedProjectsData.master_plan === "object") {
        updatedProjectsData.master_plan =
          updatedProjectsData.master_plan._id ||
          updatedProjectsData.master_plan.s3_link ||
          "";
      }
      if (updatedProjectsData.brochure && typeof updatedProjectsData.brochure === "object") {
        updatedProjectsData.brochure = updatedProjectsData.brochure._id || "";
      }
      if (updatedProjectsData.location_map && typeof updatedProjectsData.location_map === "object") {
        updatedProjectsData.location_map =
          updatedProjectsData.location_map._id ||
          updatedProjectsData.location_map.s3_link ||
          "";
      }
    } catch (error) {
      toast({
        title: "Data Error",
        description: "There was an issue preparing the project data. Please review the form and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

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
        navigate("/builder-projects");
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
        setProjects({
          ...project,
          images: [],
          contact_details: []
        });
        navigate("/builder-projects");
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      toast({
        title: "Error Occurred!",
        description: apiMessage || "Failed to save project. Please check all required fields and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
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
    navigate("/builder-projects");
  };
  if (loading && isEditable) {
    return <Loader />;
  }

  return (
    <div className="px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {isEditable ? "Edit project" : "Add new project"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Fill the key details first, then add location, plans, media, and SEO.
            </p>
          </div>
          <Link
            to="/builder-projects"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to projects
          </Link>
        </div>

        {submitAttempted && (formErrors?.name || formErrors?.slug) && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <div className="font-semibold">Fix the highlighted fields</div>
            <div className="mt-1 text-rose-700">
              {formErrors?.name ? `• ${formErrors.name} ` : ""}
              {formErrors?.slug ? `• ${formErrors.slug}` : ""}
            </div>
          </div>
        )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form
          className="p-4 sm:p-6"
          onSubmit={handleSaveAndUpdateProject}
        >
          <div className="space-y-6 add-project-form-shell">
            <ProjectDetails showValidation={submitAttempted} errors={formErrors} />
            <Location />
            <FloorPlans />
            <div className="saas-card">
              <div className="saas-card-header">
                <div>
                  <div className="saas-card-title">Master plan</div>
                  <div className="saas-card-subtitle">
                    Upload a single plan image; preview appears after upload.
                  </div>
                </div>
              </div>
              <div className="saas-card-body">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
                  <div>
                    <ImageUpload
                      images={images}
                      setImages={setImages}
                      progress={progress}
                      setProgress={setProgress}
                      uploadFile={handleUploadFile}
                      isUploaded={isUploaded}
                    />
                  </div>
                  <div>
                    {(projects?.master_plan?.s3_link || projects.master_plan) && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="mb-2 text-xs font-medium text-slate-500">
                          Preview
                        </p>
                        <img
                          src={projects?.master_plan?.s3_link || projects.master_plan}
                          alt="Master plan preview"
                          className="h-auto w-full max-w-md rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <ProjectAmenities />
            <ProjectEditor />

            <ProjectImage />
            <ProjectSeo />
          </div>
        </form>
      </div>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleCancel}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndUpdateProject}
            className="h-10 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
          >
            {isEditable ? "Update project" : "Save project"}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AddBuilderprojects;
