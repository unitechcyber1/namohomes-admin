import React, { useState, useEffect } from "react";
import {
  getCitiesByState,
  getCountries,
  getMicrolocationsByCity,
  getStatesByCountry,
} from "services/projectService";
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
        updatedProjects[section][subSection][name] = type === 'checkbox' ? checked : value;
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
                  required
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
                  required
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
            <h4 className="property_form_h4">Metro Details</h4>
          </div>
          <div className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                name="is_near_metro"
                checked={projects?.location?.metro_detail?.is_near_metro}
                onChange={(e) => handleInputChange(e, 'location', 'metro_detail')}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Is Metro Near
              </label>
            </div>
          </div>
          {projects?.location?.metro_detail?.is_near_metro && <div className="col-md-3">
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control"
                id="floatingInputLongi"
                placeholder="Nearest Metro"
                name="name"
                value={projects?.location?.metro_detail?.name || ""}
                onChange={(e) => handleInputChange(e, 'location', 'metro_detail')}
              />
              <label htmlFor="floatingInputLongi">Nearest Metro</label>
            </div>
          </div>}
        </div>
      </div>
    </>
  );
};

export default Location;
