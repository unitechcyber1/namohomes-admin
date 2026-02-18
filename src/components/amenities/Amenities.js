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
import { getAmenityById, getAmenities, updateAmenity, createAmenity, deleteAmenityById } from "services/amenityService";

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
        await updateAmenity(amenity._id, amenity)
      } else {
        await createAmenity(amenity)
      }
      setAmenity({ name: "", icon: "", isResidential: false, isCommercial: false })
      onClose();
      getAmenitiesData();
      toast({
        title: isEdit ? "Update Successfully!" : "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message || "Failed to save amenity. Please check all fields and try again.",
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
  const getAmenitiesData = async () => {
    try {
      setisLoading(true);
      const data = await getAmenities();
      setAmenities(data);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      toast({
        title: "Error Loading Amenities",
        description: error.message || "Failed to load amenities. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGetAmenityById = async (id) => {
    try {
      const data = await getAmenityById(id)
      setAmenity(data);
      setIsEdit(true)
    } catch (error) {
      toast({
        title: "Error Loading Amenity",
        description: error.message || "Failed to load amenity details. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
      await deleteAmenityById(id);
      getAmenitiesData();
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message || "Failed to delete amenity. Please try again.",
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
    getAmenitiesData();
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

  const totalPages = Math.ceil(
    (showAll ? amenities.length : searchedAmenities.length) / selectItemNum
  );
  
    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };

  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
         <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Amenities Model</h2>
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

export default Amenities;
