import React, { useState, useEffect } from "react";
import {
  getCitiesByState,
  getCountries,
  getMicrolocationsByCity,
  getStatesByCountry,
} from "../../../services/projectService";
import Select from "react-select";
import { GpState } from "../../../context/context";
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
    const initialState = stateOptions.find(
      (option) => option.value === editProject?.location?.state
    );
    if (initialState && isEditable) {
      setSelectedState(initialState);
    } else {
      setSelectedState(null);
    }
  }, [states]);
  useEffect(() => {
    const initialCity = cityOptions.find(
      (option) => option.value === editProject?.location?.city
    );
    if (initialCity && isEditable) {
      setSelectedCity(initialCity);
    } else {
      setSelectedCity(null);
    }
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
    <>
      <div className="project-card">
        <div className="row top-margin">
          <h4 className="property_form_h4">Location</h4>
        </div>
        <div className="row mt-4">
          <div className="col-md-4">
            <div>
              <Select
                placeholder="Country*"
                value={selectedCountry}
                options={countryOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "country")
                }
                isSearchable
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <Select
                placeholder="State*"
                value={selectedState}
                options={stateOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "state")
                }
                onMenuOpen={handleFetchCity}
                isSearchable
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <Select
                placeholder="City*"
                value={selectedCity}
                options={cityOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "city")
                }
                isSearchable
                required
              />
            </div>
          </div>

        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control uniform-select  "
                id="floatingInputAddress"
                placeholder="Address"
                name="address"
                value={projects?.location?.address || ""}
                onChange={(e) => handleInputChange(e, 'location')}
              />
              <label className="custompadd" htmlFor="floatingInputAddress">Address</label>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Location*"
                value={selectedMicroLocation}
                options={microLocationOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "microLocation")
                }
                isMulti
                isSearchable
                required
              />
            </div>
          </div>
        </div>
        <div className="row mt-4 mb-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <h5 className="property_form_h5 mb-0">Primary</h5>
            </div>


            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInputLatti"
                  placeholder="Latitude"
                  name="latitude"
                  value={projects?.location?.latitude || ""}
                  onChange={(e) => handleInputChange(e, 'location')}
                />
                <label className="custompadd" htmlFor="floatingInputLatti">Latitude</label>
              </div>
            </div>


            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInputLongi"
                  placeholder="Longitude"
                  name="longitude"
                  value={projects?.location?.longitude || ""}
                  onChange={(e) => handleInputChange(e, 'location')}
                />
                <label className="custompadd" htmlFor="floatingInputLongi">Longitude</label>
              </div>
            </div>
          </div>

          <div className="row align-items-center mb-3">
            {/* Label */}
            <div className="col-auto">
              <h4 className="property_form_h4 mb-0">Secondary</h4>
            </div>

            {/* Latitude input */}
            <div className="col">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInputLatti2"
                  placeholder="Latitude"
                  name="latitude2"
                  value={projects?.location?.latitude2 || ""}
                  onChange={(e) => handleInputChange(e, 'location')}
                />
                <label className="custompadd" htmlFor="floatingInputLatti2">Latitude</label>
              </div>
            </div>

            {/* Longitude input */}
            <div className="col">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInputLongi2"
                  placeholder="Longitude"
                  name="longitude2"
                  value={projects?.location?.longitude2 || ""}
                  onChange={(e) => handleInputChange(e, 'location')}
                />
                <label className="custompadd" htmlFor="floatingInputLongi2">Longitude</label>
              </div>
            </div>
          </div>

        </div>
        <div className="row mt-4">
          <div className="col-md-12">
            <h4 className="property_form_h4">Metro details</h4>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="metro_near_checkbox"
                name="is_near_metro"
                checked={!!projects?.location?.metro_detail?.is_near_metro}
                onChange={(e) => handleInputChange(e, "location", "metro_detail")}
              />
              <label className="form-check-label" htmlFor="metro_near_checkbox">
                Near metro
              </label>
            </div>
          </div>
          {projects?.location?.metro_detail?.is_near_metro && (
            <>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="metro_name_input"
                    placeholder="Nearest metro"
                    name="name"
                    value={projects?.location?.metro_detail?.name || ""}
                    onChange={(e) => handleInputChange(e, "location", "metro_detail")}
                  />
                  <label htmlFor="metro_name_input">Nearest metro</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="form-control"
                    id="metro_distance_input"
                    placeholder="Distance (km)"
                    name="distance"
                    value={
                      projects?.location?.metro_detail?.distance === "" ||
                      projects?.location?.metro_detail?.distance == null
                        ? ""
                        : projects?.location?.metro_detail?.distance
                    }
                    onChange={(e) => handleInputChange(e, "location", "metro_detail")}
                  />
                  <label htmlFor="metro_distance_input">Distance (km)</label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* School */}
        <div className="row mt-4">
          <div className="col-md-12">
            <h4 className="property_form_h4">School</h4>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="school_near_checkbox"
                name="is_near_school"
                checked={!!projects?.location?.school_detail?.is_near_school}
                onChange={(e) => handleInputChange(e, "location", "school_detail")}
              />
              <label className="form-check-label" htmlFor="school_near_checkbox">
                Near school
              </label>
            </div>
          </div>
          {projects?.location?.school_detail?.is_near_school && (
            <>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="school_name_input"
                    placeholder="School name"
                    name="name"
                    value={projects?.location?.school_detail?.name || ""}
                    onChange={(e) => handleInputChange(e, "location", "school_detail")}
                  />
                  <label htmlFor="school_name_input">School name</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="form-control"
                    id="school_distance_input"
                    name="distance"
                    value={
                      projects?.location?.school_detail?.distance === "" ||
                      projects?.location?.school_detail?.distance == null
                        ? ""
                        : projects?.location?.school_detail?.distance
                    }
                    onChange={(e) => handleInputChange(e, "location", "school_detail")}
                  />
                  <label htmlFor="school_distance_input">Distance (km)</label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* College */}
        <div className="row mt-4">
          <div className="col-md-12">
            <h4 className="property_form_h4">College</h4>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="college_near_checkbox"
                name="is_near_college"
                checked={!!projects?.location?.college_detail?.is_near_college}
                onChange={(e) => handleInputChange(e, "location", "college_detail")}
              />
              <label className="form-check-label" htmlFor="college_near_checkbox">
                Near college
              </label>
            </div>
          </div>
          {projects?.location?.college_detail?.is_near_college && (
            <>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="college_name_input"
                    placeholder="College name"
                    name="name"
                    value={projects?.location?.college_detail?.name || ""}
                    onChange={(e) => handleInputChange(e, "location", "college_detail")}
                  />
                  <label htmlFor="college_name_input">College name</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="form-control"
                    id="college_distance_input"
                    name="distance"
                    value={
                      projects?.location?.college_detail?.distance === "" ||
                      projects?.location?.college_detail?.distance == null
                        ? ""
                        : projects?.location?.college_detail?.distance
                    }
                    onChange={(e) => handleInputChange(e, "location", "college_detail")}
                  />
                  <label htmlFor="college_distance_input">Distance (km)</label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Market */}
        <div className="row mt-4">
          <div className="col-md-12">
            <h4 className="property_form_h4">Market</h4>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="market_near_checkbox"
                name="is_near_market"
                checked={!!projects?.location?.market_detail?.is_near_market}
                onChange={(e) => handleInputChange(e, "location", "market_detail")}
              />
              <label className="form-check-label" htmlFor="market_near_checkbox">
                Near market
              </label>
            </div>
          </div>
          {projects?.location?.market_detail?.is_near_market && (
            <>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="market_name_input"
                    placeholder="Market name"
                    name="name"
                    value={projects?.location?.market_detail?.name || ""}
                    onChange={(e) => handleInputChange(e, "location", "market_detail")}
                  />
                  <label htmlFor="market_name_input">Market name</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="form-control"
                    id="market_distance_input"
                    name="distance"
                    value={
                      projects?.location?.market_detail?.distance === "" ||
                      projects?.location?.market_detail?.distance == null
                        ? ""
                        : projects?.location?.market_detail?.distance
                    }
                    onChange={(e) => handleInputChange(e, "location", "market_detail")}
                  />
                  <label htmlFor="market_distance_input">Distance (km)</label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hospital */}
        <div className="row mt-4 mb-4">
          <div className="col-md-12">
            <h4 className="property_form_h4">Hospital</h4>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="hospital_near_checkbox"
                name="is_near_hospital"
                checked={!!projects?.location?.hospital_detail?.is_near_hospital}
                onChange={(e) => handleInputChange(e, "location", "hospital_detail")}
              />
              <label className="form-check-label" htmlFor="hospital_near_checkbox">
                Near hospital
              </label>
            </div>
          </div>
          {projects?.location?.hospital_detail?.is_near_hospital && (
            <>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="hospital_name_input"
                    placeholder="Hospital name"
                    name="name"
                    value={projects?.location?.hospital_detail?.name || ""}
                    onChange={(e) => handleInputChange(e, "location", "hospital_detail")}
                  />
                  <label htmlFor="hospital_name_input">Hospital name</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating border_field">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="form-control"
                    id="hospital_distance_input"
                    name="distance"
                    value={
                      projects?.location?.hospital_detail?.distance === "" ||
                      projects?.location?.hospital_detail?.distance == null
                        ? ""
                        : projects?.location?.hospital_detail?.distance
                    }
                    onChange={(e) => handleInputChange(e, "location", "hospital_detail")}
                  />
                  <label htmlFor="hospital_distance_input">Distance (km)</label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Location;
