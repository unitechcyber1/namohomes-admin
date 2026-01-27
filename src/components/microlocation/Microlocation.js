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
import {
  getCountry,
  getCityByState,
  getStateByCountry,
  getMicroLocation,
  deleteMicrolocations,
} from "./MicrolocationService";
import Select from "react-select";
import EditMicrolocation from "./EditMicrolocation";
import ImageUpload from "../../ImageUpload";
import { uploadFile } from "../../services/Services";
function City() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [microlocationfield, setMicrolocationfield] = useState({
    name: "",
    country: "",
    state: "",
    description: "",
    city: "",
  });
  const [states, setStates] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const [searchedMicrolocation, setSearchedMicrolocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const { country, setCountry } = GpState();
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);

  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? microlocations.length : searchedMicrolocation?.length) /
      recordsPerPage
  );

  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMicrolocationfield({
      ...microlocationfield,
      [name]: value,
    });
  };
  const previewFile = (data) => {
    const allimages = images;
    setImages(allimages.concat(data));
  };

  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };
  const handleSaveMicrolocations = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/admin/microlocation/microlocations`,
        {
          name: microlocationfield.name,
          description: microlocationfield.description,
          image: images[0],
          country: selectedCountry.value,
          state: selectedState.value,
          city: selectedCity.value,
        }
      );
      setMicrolocationfield({
        name: "",
        description: "",
        country: "",
        state: "",
        city: "",
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
  const handleFetchCity = async (stateId) => {
    await getCityByState(stateId, setCities);
  };
  const handleFetchStates = async (countryId) => {
    await getStateByCountry(countryId, setStates);
  };
  const handleFetchCountry = async () => {
    await getCountry(setCountry);
  };
  const handleFetchMicrolocation = async () => {
    await getMicroLocation(setMicrolocations, setLoading);
  };
  const handleDeleteMicrolocations = async (id) => {
    await deleteMicrolocations(id, setUpdateTable, toast);
  };
  const handleSearch = () => {
    const filteredMicrolocation = microlocations.filter((micro) => {
      const matchName =
        micro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(micro.name.toLowerCase());

      return matchName;
    });

    setSearchedMicrolocation(filteredMicrolocation);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);
  useEffect(() => {
    handleFetchCountry();
    handleFetchMicrolocation();
  }, [updateTable]);

  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(
      (showAll ? microlocations.length : searchedMicrolocation.length) /
        selectItemNum
    );
    if (curPage < lastPage) {
      setCurPage((prev) => prev + 1);
    }
  };

  const getFirstPage = () => {
    setCurPage(1);
  };

  const getLastPage = () => {
    setCurPage(nPage);
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
  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
        <div className="d-flex justify-content-end w-100 mt-2">
          <Button className="addnew-btn" onClick={onOpen}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Microlocation</ModalHeader>
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
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      name="name"
                      value={microlocationfield.name}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Name"
                      className="property-input"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      name="description"
                      value={microlocationfield.description}
                      onChange={handleInputChange}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveMicrolocations}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Location Module</div>
          <TableContainer
            marginTop="60px"
            variant="striped"
            color="teal"
            overflowX="hidden"
          >
            <div className="row">
              <div className="col-md-3">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Search by name</label>
                </div>
              </div>
            </div>
            <Table variant="simple" marginTop="20px">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Country</Th>
                  <Th>State</Th>
                  <Th>City</Th>
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
                  microlocations
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((micro) => (
                      <Tr key={micro._id} id={micro._id}>
                        <Td>{micro?.name}</Td>
                        <Td>{micro.country?.name}</Td>
                        <Td>{micro.state?.name}</Td>
                        <Td>{micro.city?.name}</Td>
                        <Td>{micro.active === true ? "Active" : "Inactive"}</Td>
                        <Td>
                          <EditMicrolocation
                            id={micro._id}
                            microlocations={micro}
                            setUpdateTable={setUpdateTable}
                            setSearchTerm={setSearchTerm}
                          />
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeleteMicrolocations(micro._id)
                            }
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedMicrolocation.length > 0 ? (
                  searchedMicrolocation
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((micro) => (
                      <Tr key={micro._id} id={micro._id}>
                        <Td>{micro?.name}</Td>
                        <Td>{micro.country?.name}</Td>
                        <Td>{micro.state?.name}</Td>
                        <Td>{micro.city?.name}</Td>
                        <Td>{micro.active === true ? "Active" : "Inactive"}</Td>
                        <Td>
                          <EditMicrolocation
                            id={micro._id}
                            microlocations={micro}
                            setUpdateTable={setUpdateTable}
                            setSearchTerm={setSearchTerm}
                          />
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeleteMicrolocations(micro._id)
                            }
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
          <nav className="mt-5">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "51%" }}
            >
              <p className="mb-0">Items per page: </p>
              <div style={{ borderBottom: "1px solid gray" }}>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  required
                  value={selectItemNum}
                  onChange={itemsPerPageHandler}
                  style={{ paddingLeft: "0" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? microlocations.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedMicrolocation?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of{" "}
                {showAll
                  ? microlocations?.length
                  : searchedMicrolocation.length}
              </div>

              <div className="page-item">
                <BiSkipPrevious onClick={getFirstPage} />
              </div>
              <div className="page-item">
                <GrFormPrevious onClick={prePage} />
              </div>
              <div className="page-item">
                <GrFormNext onClick={nextPage} />
              </div>
              <div className="page-item">
                <BiSkipNext onClick={getLastPage} />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default City;
