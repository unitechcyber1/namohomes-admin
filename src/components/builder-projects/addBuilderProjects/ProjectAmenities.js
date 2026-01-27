import React, { useEffect, useState } from "react";
import { getAmenities } from "../ProjectService";
import { GpState } from "../../../context/context";
const ProjectAmenities = () => {
  const { setProjects, projects } =
    GpState();
  const [amenities, setAmenities] = useState([]);
  const handleFetchAmenity = async () => {
    let params;
    if (projects.project_type === 'residential') {
      params = { isResidential: true }
    }
    if (projects.project_type === 'commercial') {
      params = { isCommercial: true }
    }
    const data = await getAmenities(params);
    setAmenities(data)
  };

  const handleCheckboxChange = (event) => {
    const checkedAmenityId = event.target.value;
    const isChecked = event.target.checked;
    const projectType = projects.project_type;
    if (isChecked) {
      setProjects((prev) => ({
        ...prev,
        allAmenities: {
          residential:
            projectType === "residential"
              ? [...prev.allAmenities.residential, checkedAmenityId]
              : prev.allAmenities.residential,
          commercial:
            projectType === "commercial"
              ? [...prev.allAmenities.commercial, checkedAmenityId]
              : prev.allAmenities.commercial,
        },
      }));
    } else {
      setProjects((prev) => ({
        ...prev,
        allAmenities: {
          residential:
            projectType === "residential"
              ? prev.allAmenities.residential.filter((id) => id !== checkedAmenityId)
              : prev.allAmenities.residential,
          commercial:
            projectType === "commercial"
              ? prev.allAmenities.commercial.filter((id) => id !== checkedAmenityId)
              : prev.allAmenities.commercial,
        },
      }));
    }
  };
  useEffect(() => {
    handleFetchAmenity();
  }, [projects.project_type]);
  return (
    <>
      {" "}
      <div className="row top-margin">
        <h4 className="property_form_h4">Project Amenities</h4>
        <div className="form-check" style={{ marginLeft: "9px" }}>
          {amenities?.map((amenity) => (
            <div key={amenity._id}>
              <input
                className="form-check-input"
                type="checkbox"
                value={amenity._id}
                id="flexCheckDefault"
                name="amenity"
                onChange={handleCheckboxChange}
                checked={projects.project_type === 'residential' ? projects.allAmenities.residential.includes(amenity._id) : projects.allAmenities.commercial.includes(amenity._id)}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectAmenities;
