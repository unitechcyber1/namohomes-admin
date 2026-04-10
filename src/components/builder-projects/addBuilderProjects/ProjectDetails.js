import React, { useState, useEffect } from "react";
import { getBuilders } from "../../../services/projectService";
import Select from "react-select";
import { GpState } from "../../../context/context";
import { getPropertyTypes } from "../../../services/propertyTypeService";
import { projectFormSelectStyles } from "./projectFormSelectStyles";

const formatIndianPriceShort = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "";

  const abs = Math.abs(num);
  if (abs >= 10000000) {
    const crore = (num / 10000000).toFixed(2).replace(/\.?0+$/, "");
    return `${crore} crore`;
  }
  if (abs >= 100000) {
    const lakh = (num / 100000).toFixed(2).replace(/\.?0+$/, "");
    return `${lakh} lakh`;
  }
  if (abs >= 1000) {
    const thousand = (num / 1000).toFixed(2).replace(/\.?0+$/, "");
    return `${thousand} thousand`;
  }
  return `${num}`;
};

const ProjectDetails = ({ showValidation = false, errors = {} }) => {
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
  const startingPriceInWords = formatIndianPriceShort(projects?.starting_price);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const next =
      name === "project_type"
        ? String(value).trim().toLowerCase() === "commercial"
          ? "commercial"
          : "residential"
        : value;
    setProjects({
      ...projects,
      [name]: next,
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
        setProjects((prev) => ({
          ...prev,
          builder: selectedOption?.value ?? "",
        }));
        break;
      default:
        break;
    }
  };
  const handleFetchbuilders = async () => {
    const data = await getBuilders();
    setbuilders(data)
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
  const nameInvalid =
    showValidation && !String(projects?.name ?? "").trim();
  const slugInvalid =
    showValidation && !String(projects?.slug ?? "").trim();

  const inputErrorClass =
    "border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/25";

  return (
    <div className="saas-card add-project-form-shell">
      <div className="saas-card-header">
        <div>
          <div className="saas-card-title">Project details</div>
          <div className="saas-card-subtitle">
            Name, slug, builder, type, pricing, and listing options.
          </div>
        </div>
      </div>

      <div className="saas-card-body space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="project-field-block lg:col-span-2">
            <label className="saas-label" htmlFor="project-name-input">
              Name of project <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="project-name-input"
              name="name"
              value={projects.name ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. Skyline Residences"
              className={[
                "saas-input",
                nameInvalid ? inputErrorClass : "",
              ].join(" ")}
              required
              aria-invalid={nameInvalid ? "true" : "false"}
              aria-describedby={nameInvalid ? "project-name-error" : undefined}
            />
            {nameInvalid && (
              <span
                id="project-name-error"
                className="mt-1 block text-xs font-medium text-rose-600"
              >
                {errors?.name || "Project name is required."}
              </span>
            )}
          </div>

          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-slug-input">
              Slug <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="project-slug-input"
              name="slug"
              value={projects.slug ?? ""}
              onChange={handleInputChange}
              placeholder="url-friendly-name"
              className={[
                "saas-input font-mono text-[13px]",
                slugInvalid ? inputErrorClass : "",
              ].join(" ")}
              required
              aria-invalid={slugInvalid ? "true" : "false"}
              aria-describedby={slugInvalid ? "project-slug-error" : undefined}
            />
            {slugInvalid && (
              <span
                id="project-slug-error"
                className="mt-1 block text-xs font-medium text-rose-600"
              >
                {errors?.slug || "Slug is required."}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-builder-select">
              Builder
            </label>
            <Select
              inputId="project-builder-select"
              placeholder="Search builder…"
              value={selectedBuilder}
              options={builderOptions}
              onChange={(v) => onChangeOptionHandler(v, "builder")}
              isSearchable
              isClearable
              styles={projectFormSelectStyles}
            />
            <p className="saas-help">Link this project to a builder profile.</p>
          </div>

          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-type-select">
              Project type
            </label>
            <select
              id="project-type-select"
              className="project-native-select"
              value={projects.project_type}
              name="project_type"
              onChange={handleInputChange}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-plan-select">
              Plan type
            </label>
            <select
              id="project-plan-select"
              className="project-native-select"
              value={selectedPlanName}
              onChange={handleItemSelect}
            >
              <option value="">Select plan</option>
              {filteredPlanType?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-starting-price">
              Starting price <span className="text-rose-600">*</span>
            </label>
            <input
              type="number"
              id="project-starting-price"
              name="starting_price"
              value={projects.starting_price ?? ""}
              onChange={handleInputChange}
              placeholder="Amount in ₹"
              className="saas-input"
              min={0}
              required
            />
            {startingPriceInWords ? (
              <p className="saas-help">{startingPriceInWords}</p>
            ) : (
              <p className="saas-help">Shown on the listing as a readable amount.</p>
            )}
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-configuration">
              Configuration <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="project-configuration"
              name="configuration"
              value={projects.configuration ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. 2, 3 & 4 BHK"
              className="saas-input"
              required
            />
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-status-select">
              Project status <span className="text-rose-600">*</span>
            </label>
            <select
              id="project-status-select"
              className="project-native-select"
              name="project_status"
              value={projects.project_status ?? ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Select status</option>
              <option value="Ready To Move">Ready To Move</option>
              <option value="Under Construction">Under Construction</option>
              <option value="New Launch">New Launch</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-size">
              Project size
            </label>
            <input
              type="text"
              id="project-size"
              name="project_size"
              value={projects.project_size ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. 5 acres"
              className="saas-input"
            />
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-ratings">
              Ratings
            </label>
            <input
              type="text"
              id="project-ratings"
              name="ratings"
              value={projects.ratings ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. 4.5"
              className="saas-input"
            />
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="project-tag">
              Project tag
            </label>
            <input
              type="text"
              id="project-tag"
              name="project_tag"
              value={projects.project_tag ?? ""}
              onChange={handleInputChange}
              placeholder="e.g. Luxury"
              className="saas-input"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Listing options
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "for_sale_checkbox", name: "for_sale", label: "For sale" },
              { id: "for_rent_checkbox", name: "for_rent", label: "For rent" },
              {
                id: "rera_approved_checkbox",
                name: "is_rera_approved",
                label: "RERA approved",
              },
              {
                id: "zero_brokerage_checkbox",
                name: "is_zero_brokerage",
                label: "Zero brokerage",
              },
            ].map(({ id, name, label }) => (
              <label
                key={id}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80"
              >
                <input
                  id={id}
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
                  type="checkbox"
                  name={name}
                  checked={!!projects[name]}
                  onChange={handleCheckboxChange}
                />
                <span className="text-sm font-medium text-slate-800">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="project-field-block">
          <label className="saas-label" htmlFor="project-video">
            Video link
          </label>
          <textarea
            id="project-video"
            name="video"
            rows={4}
            value={projects?.video ?? ""}
            onChange={handleInputChange}
            placeholder="YouTube or other embed / watch URL"
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
          />
          <p className="saas-help">Optional. Paste a single link or short notes.</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
