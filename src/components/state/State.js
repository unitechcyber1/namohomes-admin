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
import { getCountry } from "../builder-projects/ProjectService";
import { deleteStateById, getStateData } from "services/stateService";
import Select from "react-select";
function State() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [statefield, setStatefield] = useState({
    name: "",
    country: "",
    description: "",
  });
  const [searchedState, setSearchedState] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const { country, setCountry } = GpState();

  const [selectItemNum, setSelectItemNum] = useState(10);

  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? states.length : searchedState?.length) / recordsPerPage
  );
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatefield({
      ...statefield,
      [name]: value,
    });
  };

  const handleSaveStates = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/admin/state/states`, {
        name: statefield.name,
        description: statefield.description,
        country: selectedCountry.value,
      });
      setStatefield({
        name: "",
        description: "",
        country: "",
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
    const filteredState = states.filter((state) => {
      const matchName =
        state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(state.name.toLowerCase());

      return matchName;
    });

    setSearchedState(filteredState);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);
  const handleFetchCountry = async () => {
    await getCountry(setCountry);
  };
  const handleFetchStates = async () => {
      setLoading(true);
      let data =await getStateData();
      setStates(data);
      setLoading(false);
    };
  const handleDeleteStates = async (id) => {
     
       try {
      await deleteStateById(id);
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
    handleFetchStates();
    handleFetchCountry();
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
      (showAll ? states.length : searchedState.length) / selectItemNum
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

  const [selectedCountry, setSelectedCountry] = useState(null);

  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "country":
        setSelectedCountry(selectedOption);
        break;
      default:
        break;
    }
  };
  const countryOptions = country?.map((item) => ({
    value: item._id,
    label: item.name,
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
              <ModalHeader>Add New State</ModalHeader>
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
                </div>

                <input
                  name="name"
                  value={statefield.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
                <input
                  name="description"
                  value={statefield.description}
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
                <Button variant="ghost" onClick={handleSaveStates}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">State Module</div>
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
                  states
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((state) => (
                      <Tr key={state._id} id={state._id}>
                        <Td>{state?.name}</Td>
                        <Td>{state?.country?.name}</Td>

                        <Td>
                          <Delete
                            handleFunction={() => handleDeleteStates(state._id)}
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedState.length > 0 ? (
                  searchedState
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((state) => (
                      <Tr key={state._id} id={state._id}>
                        <Td>{state?.name}</Td>
                        <Td>{state?.country?.name}</Td>

                        <Td>
                          <Delete
                            handleFunction={() => handleDeleteStates(state._id)}
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
                  ? states.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedState?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of {showAll ? states?.length : searchedState.length}
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

export default State;
