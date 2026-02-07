import React, { useState, useEffect } from "react";
import { getBuilders } from "services/projectService";
import Select from "react-select";
import { GpState } from "../../../context/context";
import { getPropertyTypes } from "services/propertyTypeService";
const ProjectDetails = () => {
  const {
    projects,
    setProjects,
    editProject,
    isEditable,
  } = GpState();
  const [builders, setbuilders] = useState([]);
  const [planType, setPlanType] = useState([])
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjects({
      ...projects,
      [name]: value,
    });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setProjects({ ...projects, [name]: checked });
  };
  const builderOptions = builders?.map((builder) => ({
    value: builder._id,
    label: builder.name,
  }));
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "builder":
        setSelectedBuilder(selectedOption);
        projects.builder = selectedOption.value
        break;
      default:
        break;
    }
  };
  const handleFetchbuilders = async () => {
    await getBuilders(setbuilders);
  };
  const handleFetchPlanType = async () => {
    const data = await getPropertyTypes();
    setPlanType(data);
  }
  const handleItemSelect = (e) => {
    const selectedItemValue = e.target.value;
    const selectedPlan = filteredPlanType.find(
      (item) => item.name === selectedItemValue
    );
    if (selectedPlan) {
      setProjects((prev) => ({
        ...prev,
        plans_type: selectedPlan._id
      }))
      setSelectedPlanName(selectedPlan.name);
    } else {
      setProjects((prev) => ({
        ...prev,
        plans_type: null
      }))
      setSelectedPlanName("");
    }
  };
  const residentialPlan = ["6501887887a793abe11b9081", "65018a3c87a793abe11b90a0", "6530b4079c394a3277094380", "6501860d87a793abe11b8fdb", '6501861387a793abe11b8fe0', '650185fc87a793abe11b8fd1', '650185ef87a793abe11b8fcc', '6501887e87a793abe11b9086', '6501888d87a793abe11b908b',]
  const commercialPlan = ["6501889687a793abe11b9090", "6501889f87a793abe11b9095", "655f4a500bb98dbecc38ad75"]
  const filteredPlanType = planType?.filter(item => {
    if (projects.project_type === 'residential') { 
      return residentialPlan.includes(item._id)
    } else if (projects.project_type === 'commercial') {
      return commercialPlan.includes(item._id)
    }
    return true;
  });
  useEffect(() => {
    if (editProject?.plans_type && isEditable) {
      const selectedPlan = planType.find((item) => item._id === editProject?.plans_type);
      if (selectedPlan && true) {
        setSelectedPlanName(selectedPlan.name);
      }
    }
  }, [editProject, planType]); 
  useEffect(() => {
    handleFetchbuilders();
    handleFetchPlanType();
  }, []);
  useEffect(() => {
    const initialBuilder = builderOptions.find(
      (option) => option.value === editProject?.builder
    );
    if (initialBuilder && isEditable) {
      setSelectedBuilder(initialBuilder);
    } else {
      setSelectedBuilder(null);
    }
  }, [builders]);
  return (
    <>
      {" "}
       <div className="project-card">
      <div className="row top-margin">
     
        <div className="col-md-12">
          <h4>Projects Details</h4>
      </div>
      </div>
      <div className="col-md-4 my-4 ">
          <div className="form-floating border_field ">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Name*"
              name="name"
              value={projects.name}
              onChange={handleInputChange}
              required
            />
            <label className="custompadd" htmlFor="floatingInput">Name of Project</label>
          </div>
        </div>
      <div className="row d-flex align-items-baseline">
        <div className="col-md-4">
          <div>
            <Select
              placeholder="Builder"
              value={selectedBuilder}
              options={builderOptions}
              onChange={(v) => onChangeOptionHandler(v, "builder")}
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />

          </div>
        </div>
        

        <div className="col-md-4">
          <div>
            <select
              className="uniform-select"
              value={projects.project_type}
              name="project_type"
              onChange={handleInputChange}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <select className="uniform-select" value={selectedPlanName} onChange={handleItemSelect}>
              <option>
                Select Plan
              </option>
              {filteredPlanType?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputSlug"
              placeholder="Slug*"
              name="slug"
              value={projects.slug}
              onChange={handleInputChange}
              required
            />
            <label className="custompadd" htmlFor="floatingInputSlug">Slug</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Starting Prices*"
              name="starting_price"
              value={projects.starting_price}
              onChange={handleInputChange}
              required
            />
            <label  className="custompadd" htmlFor="floatingInputAddress">Starting Price*</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Configuration*"
              name="configuration"
              value={projects.configuration}
              onChange={handleInputChange}
              required
            />
            <label className="custompadd" htmlFor="floatingInputAddress">Configuration*</label>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-floating border_field ">
            <select
              className="uniform-select"
              name="project_status"
              aria-label="Default select example"
              value={projects.project_status}
              onChange={handleInputChange}
              required
            >
              <option>Project Status</option>
              <option>Ready To Move</option>
              <option>Under Construction</option>
              <option>New Launch</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Project Size"
              name="project_size"
              value={projects.project_size}
              onChange={handleInputChange}
            />
            <label className="custompadd" htmlFor="floatingInputAddress">Project Size*</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Ratings"
              name="ratings"
              value={projects.ratings}
              onChange={handleInputChange}
            />
            <label className="custompadd" htmlFor="floatingInputAddress">Ratings</label>
          </div>
        </div>
      </div>
      <div className="row mt-4 d-flex align-items-baseline">
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Coming Soon"
              name="coming_soon"
              value={projects.coming_soon}
              onChange={handleInputChange}

            />
            <label className="custompadd" htmlFor="floatingInputAddress">Coming Soon</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Tagline"
              name="tagline"
              value={projects.tagline}
              onChange={handleInputChange}

            />
            <label className="custompadd" htmlFor="floatingInputAddress">Tagline</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Project Tag"
              name="project_tag"
              value={projects.project_tag}
              onChange={handleInputChange}

            />
            <label className="custompadd" htmlFor="floatingInputAddress">Project Tag</label>
          </div>
        </div>
      </div>
      <div className="row mt-4 d-flex align-items-baseline">
        <div className="col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              name="for_sale"
              checked={projects.for_sale}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label " htmlFor="flexCheckDefault">
              For Sale
            </label>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              name="for_rent"
              checked={projects.for_rent}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              For Rent
            </label>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              name="is_rera_approved"
              checked={projects.is_rera_approved}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
             RERA Approved!
            </label>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              name="is_zero_brokerage"
              checked={projects.is_zero_brokerage}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
            Brokerage!
            </label>
          </div>
        </div>

      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Short Description About Project"
              name="short_descrip"
              value={projects.short_descrip}
              onChange={handleInputChange}
            ></textarea>
            <label  className="custompadd" htmlFor="floatingInputAddress">
              Short Description About Project
            </label>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Video Link"
              name="video"
              value={projects?.video}
              onChange={handleInputChange}
            ></textarea>
            <label  className="custompadd" htmlFor="floatingInputAddress">
              Video Link
            </label>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProjectDetails;
