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
import "./City.css";
import { GpState } from "../../context/context";
import { AiFillEdit } from "react-icons/ai";
import Select from "react-select";
import { updateCityById } from "../../services/cityService";
import { getStatesByCountry } from "../../services/microlocationService";
import { getCountries } from "../../services/countryService";
const EditCity = ({ cities, setUpdateTable, setSearchTerm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(cities.name);
  const [description, setDiscription] = useState(cities.description);
  const [states, setStates] = useState([]);
  const { country, setCountry } = GpState();
  const [isChecked, setIsChecked] = useState(cities.active);
  const [cityId, setCityId] = useState(cities._id);
  const toast = useToast();
  const handleEditCity = async () => {
    if (!selectedCountry?.value || !selectedState?.value) {
      toast({
        title: "Validation",
        description: "Please select country and state.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      await updateCityById(cityId, {
        name,
        description,
        country: selectedCountry.value,
        state: selectedState.value,
        active: isChecked,
      });
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
      toast({
        title: "Update failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update city. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleFetchStates = async (countryId) => {
    try {
      const data = await getStatesByCountry(countryId);
      const list = Array.isArray(data) ? data : [];
      setStates(list);
      const stateId = cities?.state?._id;
      if (stateId && list.length) {
        const s = list.find((st) => st._id === stateId);
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
      const countryId = cities?.country?._id;
      if (countryId && list.length) {
        const c = list.find((ct) => ct._id === countryId);
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
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "country":
        setSelectedCountry(selectedOption);

        handleFetchStates(selectedOption ? selectedOption.value : null);
        break;
      case "state":
        setSelectedState(selectedOption);
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
  const handleClick = () => {
    onOpen();
    handleFetchCountry();
    handleFetchStates(cities.country._id);
  };
  useEffect(() => {
    handleFetchCountry();
    handleFetchStates(cities.country._id);
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
                  isSearchable
                  required
                />
              </div>
            </div>

            <div className="row mt-2">
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleEditCity}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCity;
