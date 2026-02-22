import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
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
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { GpState } from "../../context/context";
import Delete from "../delete/Delete";
import BASE_URL from "../../apiConfig";
import Select from "react-select";
import { deleteCityById, getCities } from "../../services/cityService";
import {
  getCountries,
} from "../../services/countryService";
import {getStatesByCountry} from '../../services/microlocationService'
import EditCity from "./EditCity";

function City() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [cityfield, setCityfield] = useState({
    name: "",
    country: "",
    state: "",
    description: "",
  });
  const [searchedCity, setSearchedCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [states, setStates] = useState([]);
  const { country, setCountry } = GpState();

  const [selectItemNum, setSelectItemNum] = useState(10);

  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const totalPages = Math.ceil(
    (showAll ? cities.length : searchedCity?.length) / recordsPerPage
  );

  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCityfield({
      ...cityfield,
      [name]: value,
    });
  };

  const handleSaveCity = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/admin/cities`, {
        name: cityfield.name,
        description: cityfield.description,
        country: selectedCountry.value,
        state: selectedState.value,
      });
      setCityfield({
        name: "",
        description: "",
        country: "",
        state: "",
      });
      setUpdateTable((prev) => !prev);
      onClose();
      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = () => {
    const filteredCity = cities.filter((city) => {
      const matchName =
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(city.name.toLowerCase());

      return matchName;
    });

    setSearchedCity(filteredCity);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);
  const handleFetchStates = async (countryId) => {
    const data = await getStatesByCountry(countryId);
    setStates(data)
  };
  const handleFetchCountry = async () => {
   const data =  await getCountries();
   setCountry(data)
  };
  const handleFetchCity = async () => {
    setLoading(true);
    let data =await getCities();
    setCities(data);
    setLoading(false);
  };

  const handleDeleteCity = async (id) => {
   
     try {
    await deleteCityById(id);
    setUpdateTable((prev) => !prev);
    toast({
      title: "Deleted Successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
  };
  useEffect(() => {
    handleFetchCountry();
    handleFetchCity();
  }, [updateTable]);


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

    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };
  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
         <div className="d-flex my-3 align-items-center justify-content-between">
         <h2 className=" mb-0"> City Module</h2>
          <Button className="addnew-btn" onClick={onOpen}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New City</ModalHeader>
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
                <input
                  name="name"
                  value={cityfield.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
                <input
                  name="description"
                  value={cityfield.description}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Description"
                  className="property-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveCity}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
       <div className="row mt-2 project-card2">
              <div className="row">
                <div className="col-md-4 px-4">
                  <input
                    type="text"
                    className="uniform-select-seo"
                    id="floatingInput"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

        <div className="table-box">
          <TableContainer
            variant="striped"
            color="teal"
            overflowX="hidden"
          >
           
            <Table variant="simple" >
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Country</Th>
                  <Th>State</Th>
                  <Th>Status</Th>
                  <Th>Edit</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td>
                      <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        style={{ position: "absolute", left: "482px" }}
                      />
                    </Td>
                  </Tr>
                ) : showAll ? (
                  cities
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((city) => (
                      <Tr key={city._id} id={city._id}>
                        <Td>{city.name}</Td>
                        <Td>{city.country?.name}</Td>
                        <Td>{city.state?.name}</Td>
                        <Td>{city.active === true ? "Active" : "Inactive"}</Td>
                        <Td>
                          <EditCity
                            id={city._id}
                            cities={city}
                            setUpdateTable={setUpdateTable}
                            setSearchTerm={setSearchTerm}
                          />
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() => handleDeleteCity(city._id)}
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedCity.length > 0 ? (
                  searchedCity
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((city) => (
                      <Tr key={city._id} id={city._id}>
                        <Td>{city.name}</Td>
                        <Td>{city.country?.name}</Td>
                        <Td>{city.state?.name}</Td>
                        <Td>{city.active === true ? "Active" : "Inactive"}</Td>
                        <Td>
                          <EditCity
                            id={city._id}
                            cities={city}
                            setUpdateTable={setUpdateTable}
                            setSearchTerm={setSearchTerm}
                          />
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() => handleDeleteCity(city._id)}
                          />
                        </Td>
                      </Tr>
                    ))
                ) : (
                  <Tr>
                    <Td colSpan={8}>No matching results found.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
           {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4 pagination-bar">

          {/* LEFT SIDE */}
          <div className="page-info">
            Showing Page <strong>{curPage}</strong> out of <strong>{totalPages}</strong>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-2 pagination-controls">
            <button
              className="page-btn"
              disabled={curPage === 1}
              onClick={() => goToPage(curPage - 1)}
            >
              Previous
            </button>

            <span className="current-page">
              {curPage}
            </span>

            <button
              className="page-btn"
              disabled={curPage === totalPages}
              onClick={() => goToPage(curPage + 1)}
            >
              Next
            </button>
          </div>

        </div>
        </div>
      </div>
    </>
  );
}

export default City;
