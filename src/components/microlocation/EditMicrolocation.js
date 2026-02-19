import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import "./Microlocation.css";
import axios from "axios";
import { GpState } from "../../context/context";
import { AiFillEdit } from "react-icons/ai";
import BASE_URL from "../../apiConfig";
import Select from "react-select";
import {
  getCountry,
  getCityByState,
  getStateByCountry,
} from "./MicrolocationService";
import { getCountries } from "services/countryService";
import { getStatesByCountry, getCitiesByState } from "services/microlocationService";
import ImageUpload from "../../ImageUpload";
import { uploadFile } from "../../services/Services";
const EditMicrolocation = ({
  microlocations,
  setUpdateTable,
  setSearchTerm,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(microlocations.name);
  const [description, setDiscription] = useState(microlocations.description);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const { country, setCountry } = GpState();
  const [isChecked, setIsChecked] = useState(microlocations.active);
  const [microId, setMicroId] = useState(microlocations._id);
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const toast = useToast();
  const previewFile = (data) => {
    const allimages = images;
    setImages(allimages.concat(data));
  };

  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };
  const handleEditMicrolocation = async () => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/microlocation/micro-by-id/${microId}`,
        {
          name: name,
          description: description,
          image: images[0],
          country: selectedCountry.value,
          state: selectedState.value,
          city: selectedCity.value,
          active: isChecked,
        }
      );
      setUpdateTable((prev) => !prev);
      setSearchTerm("");
      onClose();
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      // Error handled by service function
    }
  };
  const handleFetchCity = async (stateId) => {
    const data = await getCitiesByState(stateId);
    setCities(data);
    const initialCity = cityOptions.find(
      (option) => option.value === microlocations.city._id
    );
    if (initialCity) {
      setSelectedCity(initialCity);
    }
  };
  const handleFetchStates = async (countryId) => {
    const data = await getStatesByCountry(countryId);
    setStates(data);
    const initialState = stateOptions.find(
      (option) => option.value === microlocations.state._id
    );
    if (initialState) {
      setSelectedState(initialState);
    }
  };
  const handleFetchCountry = async () => {
    const data = await getCountries();
    setCountry(data);
    const initialCountry = countryOptions.find(
      (option) => option.value === microlocations.country._id
    );
    if (initialCountry) {
      setSelectedCountry(initialCountry);
    }
  };
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "country":
        setSelectedCountry(selectedOption);

        handleFetchStates(selectedOption ? selectedOption.value : null);
        break;
      case "state":
        setSelectedState(selectedOption);
        handleFetchCity(selectedOption ? selectedOption.value : null);
        break;
      case "city":
        setSelectedCity(selectedOption);
        break;

      default:
        break;
    }
  };
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
  const handleClick = () => {
    onOpen();
    handleFetchCountry();
    handleFetchStates(microlocations.country._id);
    handleFetchCity(microlocations.state._id);
  };
  useEffect(() => {
    handleFetchCountry();
    handleFetchStates(microlocations.country._id);
    handleFetchCity(microlocations.state?._id);
  }, []);
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    if (checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };
  return (
    <>
      <AiFillEdit
        onClick={handleClick}
        style={{ fontSize: "22px", cursor: "pointer" }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Select
                  placeholder="Country*"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={(selectedOption) =>
                    onChangeOptionHandler(selectedOption, "country")
                  }
                  isSearchable
                  required
                />{" "}
              </div>
              <div className="col-md-6">
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

            <div className="row mt-2">
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label className="checkBox_style">
                  Status
                  <input
                    type="checkbox"
                    className="property-input"
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(e)}
                  />
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
              </div>
              <div className="col-md-6">
                <input
                  name="description"
                  value={description}
                  onChange={(e) => setDiscription(e.target.value)}
                  type="text"
                  placeholder="Description"
                  className="property-input"
                />
              </div>
            </div>
            <div className="row">
              <ImageUpload
                images={images}
                setImages={setImages}
                progress={progress}
                setProgress={setProgress}
                uploadFile={handleUploadFile}
                isUploaded={isUploaded}
              />
              {microlocations.image && <img src={microlocations.image} style={{ width: "50%", marginTop: "40px" }} />}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleEditMicrolocation}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditMicrolocation;
