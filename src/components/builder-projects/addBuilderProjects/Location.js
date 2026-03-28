import React, { useState, useEffect } from "react";
import {
  getCitiesByState,
  getCountries,
  getMicrolocationsByCity,
  getStatesByCountry,
} from "../../../services/projectService";
import Select from "react-select";
import { GpState } from "../../../context/context";
import { projectFormSelectStyles } from "./projectFormSelectStyles";

const LOCATION_PROXIMITY_SECTIONS = [
  {
    title: "Metro",
    detailKey: "metro_detail",
    toggleName: "is_near_metro",
    checkboxId: "metro_near_checkbox",
    toggleLabel: "Near metro",
    nameInputId: "metro_name_input",
    distanceInputId: "metro_distance_input",
    namePlaceholder: "Nearest metro",
    nameLabel: "Nearest metro",
    distanceLabel: "Distance (km)",
  },
  {
    title: "School",
    detailKey: "school_detail",
    toggleName: "is_near_school",
    checkboxId: "school_near_checkbox",
    toggleLabel: "Near school",
    nameInputId: "school_name_input",
    distanceInputId: "school_distance_input",
    namePlaceholder: "School name",
    nameLabel: "School name",
    distanceLabel: "Distance (km)",
  },
  {
    title: "College",
    detailKey: "college_detail",
    toggleName: "is_near_college",
    checkboxId: "college_near_checkbox",
    toggleLabel: "Near college",
    nameInputId: "college_name_input",
    distanceInputId: "college_distance_input",
    namePlaceholder: "College name",
    nameLabel: "College name",
    distanceLabel: "Distance (km)",
  },
  {
    title: "Market",
    detailKey: "market_detail",
    toggleName: "is_near_market",
    checkboxId: "market_near_checkbox",
    toggleLabel: "Near market",
    nameInputId: "market_name_input",
    distanceInputId: "market_distance_input",
    namePlaceholder: "Market name",
    nameLabel: "Market name",
    distanceLabel: "Distance (km)",
  },
  {
    title: "Hospital",
    detailKey: "hospital_detail",
    toggleName: "is_near_hospital",
    checkboxId: "hospital_near_checkbox",
    toggleLabel: "Near hospital",
    nameInputId: "hospital_name_input",
    distanceInputId: "hospital_distance_input",
    namePlaceholder: "Hospital name",
    nameLabel: "Hospital name",
    distanceLabel: "Distance (km)",
  },
];

function ProximityBlock({ section, projects, handleInputChange }) {
  const detail = projects?.location?.[section.detailKey] || {};
  const checked = !!detail[section.toggleName];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-800">
        {section.title}
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <label
          htmlFor={section.checkboxId}
          className="flex cursor-pointer items-center gap-3 rounded-lg py-0.5 lg:min-w-[11rem] lg:shrink-0"
        >
          <input
            id={section.checkboxId}
            name={section.toggleName}
            type="checkbox"
            checked={checked}
            onChange={(e) =>
              handleInputChange(e, "location", section.detailKey)
            }
            className="h-4 w-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
          />
          <span className="text-sm font-medium text-slate-800">
            {section.toggleLabel}
          </span>
        </label>
        {checked && (
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control"
                id={section.nameInputId}
                placeholder={section.namePlaceholder}
                name="name"
                value={detail.name || ""}
                onChange={(e) =>
                  handleInputChange(e, "location", section.detailKey)
                }
              />
              <label className="custompadd" htmlFor={section.nameInputId}>
                {section.nameLabel}
              </label>
            </div>
            <div className="form-floating border_field">
              <input
                type="number"
                min={0}
                step="0.1"
                className="form-control"
                id={section.distanceInputId}
                placeholder={section.distanceLabel}
                name="distance"
                value={
                  detail.distance === "" || detail.distance == null
                    ? ""
                    : detail.distance
                }
                onChange={(e) =>
                  handleInputChange(e, "location", section.detailKey)
                }
              />
              <label className="custompadd" htmlFor={section.distanceInputId}>
                {section.distanceLabel}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Location = () => {
  const {
    selectedMicroLocation,
    setSelectedMicroLocation,
    selectedState,
    setSelectedState,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    projects,
    setProjects,
    isEditable,
    editProject
  } = GpState();
  const [microlocations, setMicrolocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, checked, type } = event.target;
    setProjects(prevProjects => {
      const updatedProjects = { ...prevProjects };
      if (subSection) {
        // Ensure nested objects exist
        if (!updatedProjects[section]) {
          updatedProjects[section] = {};
        }
        if (!updatedProjects[section][subSection]) {
          updatedProjects[section][subSection] = {};
        }
        if (type === "checkbox") {
          updatedProjects[section][subSection][name] = checked;
        } else if (type === "number") {
          updatedProjects[section][subSection][name] =
            value === "" ? "" : Number(value);
        } else {
          updatedProjects[section][subSection][name] = value;
        }
      } else {
        // Ensure section object exists
        if (!updatedProjects[section]) {
          updatedProjects[section] = {};
        }
        updatedProjects[section][name] = type === 'checkbox' ? checked : value;
      }
      return updatedProjects;
    });
  };
  const handleFetchCity = async (stateId) => {
    const data = await getCitiesByState(stateId);
    setCities(data);
  };
  const handleFetchStates = async (countryId) => {
    const data = await getStatesByCountry(countryId);
    setStates(data);
  };
  const handleFetchMicrolocation = async (cityId) => {
    const data = await getMicrolocationsByCity(cityId);
    setMicrolocations(data)
  };

  const handleFetchCountry = async () => {
    const data = await getCountries();
    setCountry(data);
  };
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "country":
        setSelectedCountry(selectedOption);
        handleFetchStates(selectedOption ? selectedOption.value : null);
        setProjects((prevProjects) => ({
          ...prevProjects,
          location: {
            ...prevProjects.location,
            country: selectedOption ? selectedOption.value : "",
          },
        }));
        break;
      case "city":
        setSelectedCity(selectedOption);
        handleFetchMicrolocation(selectedOption ? selectedOption.value : null);
        setProjects((prevProjects) => ({
          ...prevProjects,
          location: {
            ...prevProjects.location,
            city: selectedOption ? selectedOption.value : "",
          },
        }));
        break;
      case "state":
        setSelectedState(selectedOption);
        handleFetchCity(selectedOption ? selectedOption.value : null);
        setProjects((prevProjects) => ({
          ...prevProjects,
          location: {
            ...prevProjects.location,
            state: selectedOption ? selectedOption.value : "",
          },
        }));
        break;
      case "microLocation":
        setSelectedMicroLocation(selectedOption);
        updateMicroLocation(selectedOption)
        break;
      default:
        break;
    }
  };
  const updateMicroLocation = (selectedOption) => {
    const location = selectedOption?.map((city) => city.value);
    setProjects((prevProjects) => ({
      ...prevProjects,
      location: {
        ...(prevProjects.location || {}),
        micro_location: location || [],
      },
    }));
  };
  const microLocationOptions = microlocations?.map((microLocation) => ({
    value: microLocation._id,
    label: microLocation.name,
  }));
  const stateOptions = states?.map((state) => ({
    value: state._id,
    label: state.name,
  }));
  const countryOptions = country?.map((item) => ({
    value: item._id,
    label: item.name,
  }));
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));
  useEffect(() => {
    const defaultCountryOption = countryOptions.find(
      (option) => option.label === "India"
    );
    if (defaultCountryOption) {
      setSelectedCountry(defaultCountryOption);
      handleFetchStates(defaultCountryOption.value);
      setProjects((prevProjects) => ({
        ...prevProjects,
        location: {
          ...(prevProjects.location || {}),
          country: defaultCountryOption.value,
        },
      }));
    }
    const initialCountry = countryOptions.find(
      (option) => option.value === editProject?.location?.country
    );
    if (initialCountry && isEditable) {
      setSelectedCountry(initialCountry);
      handleFetchCity(editProject?.location?.state);
      handleFetchMicrolocation(editProject?.location?.city);
    }
  }, [country]);
  useEffect(() => {
    if (!stateOptions?.length) return;

    const initialState = stateOptions.find(
      (option) => option.value === editProject?.location?.state
    );

    if (isEditable && initialState) {
      setSelectedState(initialState);
      return;
    }

    if (!isEditable) {
      const haryana = stateOptions.find(
        (o) => o.label?.trim().toLowerCase() === "haryana"
      );
      if (haryana) {
        setSelectedState(haryana);
        handleFetchCity(haryana.value);
        setProjects((prev) => ({
          ...prev,
          location: {
            ...(prev.location || {}),
            state: haryana.value,
          },
        }));
        return;
      }
    }

    setSelectedState(initialState || null);
  }, [states]);

  useEffect(() => {
    if (!cityOptions?.length) return;

    const initialCity = cityOptions.find(
      (option) => option.value === editProject?.location?.city
    );

    if (isEditable && initialCity) {
      setSelectedCity(initialCity);
      return;
    }

    if (!isEditable) {
      const gurugram = cityOptions.find((o) => {
        const l = o.label?.trim().toLowerCase();
        return l === "gurugram" || l === "gurgaon";
      });
      if (gurugram) {
        setSelectedCity(gurugram);
        handleFetchMicrolocation(gurugram.value);
        setProjects((prev) => ({
          ...prev,
          location: {
            ...(prev.location || {}),
            city: gurugram.value,
          },
        }));
        return;
      }
    }

    setSelectedCity(initialCity || null);
  }, [cities]);

  useEffect(() => {
    handleFetchCountry();
  }, []);
  useEffect(() => {
    const initialLocation = microLocationOptions.filter((option) =>
      editProject?.location?.micro_location?.includes(option.value)
    );

    if (initialLocation && isEditable) {
      setSelectedMicroLocation(initialLocation);
    } else {
      setSelectedMicroLocation(null);
    }
  }, [microlocations]);
  return (
    <div className="saas-card add-project-form-shell">
      <div className="saas-card-header">
        <div>
          <div className="saas-card-title">Location</div>
          <div className="saas-card-subtitle">
            Country, state, city, micro-locations, address, and coordinates.
          </div>
        </div>
      </div>
      <div className="saas-card-body space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="project-field-block">
            <label className="saas-label" htmlFor="location-country-select">
              Country
            </label>
            <Select
              inputId="location-country-select"
              placeholder="Country*"
              value={selectedCountry}
              options={countryOptions}
              onChange={(selectedOption) =>
                onChangeOptionHandler(selectedOption, "country")
              }
              isSearchable
              required
              styles={projectFormSelectStyles}
            />
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="location-state-select">
              State
            </label>
            <Select
              inputId="location-state-select"
              placeholder="State*"
              value={selectedState}
              options={stateOptions}
              onChange={(selectedOption) =>
                onChangeOptionHandler(selectedOption, "state")
              }
              onMenuOpen={handleFetchCity}
              isSearchable
              required
              styles={projectFormSelectStyles}
            />
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="location-city-select">
              City
            </label>
            <Select
              inputId="location-city-select"
              placeholder="City*"
              value={selectedCity}
              options={cityOptions}
              onChange={(selectedOption) =>
                onChangeOptionHandler(selectedOption, "city")
              }
              isSearchable
              required
              styles={projectFormSelectStyles}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="location-address-input"
              placeholder="Address"
              name="address"
              value={projects?.location?.address || ""}
              onChange={(e) => handleInputChange(e, "location")}
            />
            <label className="custompadd" htmlFor="location-address-input">
              Address
            </label>
          </div>
          <div className="project-field-block">
            <label className="saas-label" htmlFor="location-micro-select">
              Micro-locations
            </label>
            <Select
              inputId="location-micro-select"
              classNamePrefix="react-select"
              placeholder="Search micro-locations…"
              value={selectedMicroLocation}
              options={microLocationOptions}
              onChange={(selectedOption) =>
                onChangeOptionHandler(selectedOption, "microLocation")
              }
              isMulti
              isSearchable
              required
              styles={projectFormSelectStyles}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Primary coordinates
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control"
                id="floatingInputLatti"
                placeholder="Latitude"
                name="latitude"
                value={projects?.location?.latitude || ""}
                onChange={(e) => handleInputChange(e, "location")}
              />
              <label className="custompadd" htmlFor="floatingInputLatti">
                Latitude
              </label>
            </div>
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control"
                id="floatingInputLongi"
                placeholder="Longitude"
                name="longitude"
                value={projects?.location?.longitude || ""}
                onChange={(e) => handleInputChange(e, "location")}
              />
              <label className="custompadd" htmlFor="floatingInputLongi">
                Longitude
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nearby places
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Toggle each category, then add the place name and distance in
            kilometers.
          </p>
          <div className="space-y-3">
            {LOCATION_PROXIMITY_SECTIONS.map((section) => (
              <ProximityBlock
                key={section.detailKey}
                section={section}
                projects={projects}
                handleInputChange={handleInputChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
