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
import { GpState } from "../../context/context";
import { AiFillEdit } from "react-icons/ai";
import Select from "react-select";
import { getCountries } from "../../services/countryService";
import {
  getStatesByCountry,
  getCitiesByState,
  updateMicrolocationById,
} from "../../services/microlocationService";
import ImageUpload from "../../ImageUpload";
import { uploadFile } from "../../services/Services";

const EditMicrolocation = ({ microlocations, onSuccess }) => {
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
    if (!selectedCountry?.value || !selectedState?.value || !selectedCity?.value) {
      toast({
        title: "Validation",
        description: "Please select country, state and city.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      await updateMicrolocationById(microId, {
        name,
        description,
        image: images[0],
        country: selectedCountry.value,
        state: selectedState.value,
        city: selectedCity.value,
        active: isChecked,
      });
      onClose();
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update microlocation. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleFetchCity = async (stateId) => {
    try {
      const data = await getCitiesByState(stateId);
      const list = Array.isArray(data) ? data : [];
      setCities(list);
      const cityId = microlocations?.city?._id;
      if (cityId && list.length) {
        const c = list.find((x) => x._id === cityId);
        if (c) setSelectedCity({ value: c._id, label: c.name });
      }
    } catch (error) {
      toast({
        title: "Failed to load cities",
        description:
          error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setCities([]);
    }
  };

  const handleFetchStates = async (countryId) => {
    try {
      const data = await getStatesByCountry(countryId);
      const list = Array.isArray(data) ? data : [];
      setStates(list);
      const stateId = microlocations?.state?._id;
      if (stateId && list.length) {
        const s = list.find((x) => x._id === stateId);
        if (s) setSelectedState({ value: s._id, label: s.name });
      }
    } catch (error) {
      toast({
        title: "Failed to load states",
        description:
          error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setStates([]);
    }
  };

  const handleFetchCountry = async () => {
    try {
      const data = await getCountries();
      const list = Array.isArray(data) ? data : [];
      setCountry(list);
      const countryId = microlocations?.country?._id;
      if (countryId && list.length) {
        const c = list.find((x) => x._id === countryId);
        if (c) setSelectedCountry({ value: c._id, label: c.name });
      }
    } catch (error) {
      toast({
        title: "Failed to load countries",
        description:
          error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
