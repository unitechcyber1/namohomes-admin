import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
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
import Delete from "../delete/Delete";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { deleteAmenity, getallAmenities, saveAmenities, getAmenityById, editAmenities } from "./amenityService";

function Amenities() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amenity, setAmenity] = useState({ name: "", icon: "", isResidential: false, isCommercial: false })
  const [isLoading, setisLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [searchedAmenities, setSearchedAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [isEdit, setIsEdit] = useState(false)
  const [selectItemNum, setSelectItemNum] = useState(10);
  const [curPage, setCurPage] = useState(1);
  const toast = useToast();

  const handleSaveAmenities = async () => {
    try {
      if (isEdit) {
        await editAmenities(amenity._id, amenity)
      } else {
        await saveAmenities(amenity)
      }
      setAmenity({ name: "", icon: "", isResidential: false, isCommercial: false })
      onClose();
      getAmenities();
      toast({
        title: isEdit ? "Update Successfully!" : "Saved Successfully!",
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
  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setAmenity((prev) => {
      const updateAmenity = { ...prev };
      updateAmenity[name] = type === 'checkbox' ? checked : value
      return updateAmenity
    })
  }
  const getAmenities = async () => {
    try {
      setisLoading(true);
      const data = await getallAmenities()
      setAmenities(data);
      setisLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetAmenityById = async (id) => {
    try {
      const data = await getAmenityById(id)
      setAmenity(data);
      setIsEdit(true)
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickEdit = (id) => {
    handleGetAmenityById(id)
    onOpen()
  }
  const handleClickAdd = () => {
    setIsEdit(false)
    setAmenity({ name: "", icon: "", isResidential: false, isCommercial: false })
    onOpen()
  }
  const handleDeleteAmenities = async (id) => {
    try {
      await deleteAmenity(id)
      getAmenities();
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
  const handleSearch = () => {
    const filteredAmenities = amenities.filter((amenity) => {
      const matchName =
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(amenity.name.toLowerCase());
      return matchName;
    });
    setSearchedAmenities(filteredAmenities);
    setCurPage(1);
  };
  useEffect(() => {
    getAmenities();
  }, []);
  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [searchTerm]);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? amenities.length : searchedAmenities.length) / selectItemNum
  );
  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }
  var nextPage = () => {
    const lastPage = Math.ceil(
      (showAll ? amenities.length : searchedAmenities.length) / selectItemNum
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
  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
        <div className="d-flex justify-content-end w-100 mt-2">
          <Button className="addnew-btn" onClick={handleClickAdd}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{isEdit ? 'Edit Amenity' : 'Add New Amenity'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  name="name"
                  value={amenity.name}
                  onChange={(e) => handleInputChange(e)}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
                <input
                  name="icon"
                  value={amenity.icon}
                  onChange={(e) => handleInputChange(e)}
                  type="text"
                  placeholder="Image Url"
                  className="property-input"
                />
                <div className="row">
                  <div className="col-md-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={amenity.isResidential}
                      id="flexCheckDefault"
                      name="isResidential"
                      onChange={(e) => handleInputChange(e)}
                      checked={amenity.isResidential}
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      Is Residential
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={amenity.isCommercial}
                      id="flexCheckDefault"
                      name="isCommercial"
                      onChange={(e) => handleInputChange(e)}
                      checked={amenity.isCommercial}
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      Is Commercial
                    </label>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveAmenities}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Amenities Module</div>
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
                  <Th>Residential</Th>
                  <Th>Commercial</Th>
                  <Th>Edit</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
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
                  amenities
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((amenity) => (
                      <Tr key={amenity._id} id={amenity._id}>
                        <Td>{amenity.name}</Td>
                        <Td>{amenity.isResidential == true ? 'Active' : 'Inactive'}</Td>
                        <Td>{amenity.isCommercial == true ? 'Active' : 'Inactive'}</Td>
                        <Td>
                          <AiFillEdit
                            onClick={() => handleClickEdit(amenity._id)}
                            style={{ fontSize: "22px", cursor: "pointer" }}
                          />
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeleteAmenities(amenity._id)
                            }
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedAmenities.length > 0 ? (
                  searchedAmenities
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((amenity) => (
                      <Tr key={amenity._id} id={amenity._id}>
                        <Td>{amenity.name}</Td>
                        <Td>{amenity.isResidential == true ? 'Active' : 'Inactive'}</Td>
                        <Td>{amenity.isCommercial == true ? 'Active' : 'Inactive'}</Td>
                        <Td>
                        <AiFillEdit
                            onClick={() => handleClickEdit(amenity._id)}
                            style={{ fontSize: "22px", cursor: "pointer" }}
                          />
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeleteAmenities(amenity._id)
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
                  value={selectItemNum}
                  onChange={itemsPerPageHandler}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? amenities.slice(
                    (curPage - 1) * selectItemNum,
                    curPage * selectItemNum
                  ).length + firstIndex
                  : searchedAmenities?.slice(
                    (curPage - 1) * selectItemNum,
                    curPage * selectItemNum
                  ).length + firstIndex}{" "}
                of {showAll ? amenities?.length : searchedAmenities.length}
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

export default Amenities;
