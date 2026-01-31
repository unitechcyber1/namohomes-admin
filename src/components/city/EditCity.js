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
import axios from "axios";
import { GpState } from "../../context/context";
import { AiFillEdit } from "react-icons/ai";
import BASE_URL from "../../apiConfig";
import Select from "react-select";
import {
  getCountry,
  getStateByCountry,
} from "../microlocation/MicrolocationService";
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
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/city-by-id/${cityId}`,
        {
          name: name,
          description: description,
          country: selectedCountry.value,
          state: selectedState.value,
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
      console.log(error);
    }
  };
  const handleFetchStates = async (countryId) => {
    await getStateByCountry(countryId, setStates);
    const initialState = stateOptions.find(
      (option) => option.value === cities.state._id
    );
    if (initialState) {
      setSelectedState(initialState);
    }
  };
  const handleFetchCountry = async () => {
    await getCountry(setCountry);
    const initialCountry = countryOptions.find(
      (option) => option.value === cities.country._id
    );
    if (initialCountry) {
      setSelectedCountry(initialCountry);
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
