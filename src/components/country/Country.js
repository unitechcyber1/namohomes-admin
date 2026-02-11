import React, { useContext, useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { GpState } from "../../context/context";
import { useToast } from "@chakra-ui/react";
import { BsBookmarkPlus } from "react-icons/bs";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
import "./Country.css";
import EditCountry from "./EditCountry";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import BASE_URL from "../../apiConfig";
function Country() {
  const { country, setCountry } = GpState();
  const [countryfield, setCountryfield] = useState({
    name: "",
    description: "",
    dialCode: "",
    isoCode: "",
  });
  const [updateTable, setUpdateTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = country?.slice(firstIndex, lastIndex);
  const totalPages  = Math.ceil(country?.length / recordsPerPage);
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCountryfield({
      ...countryfield,
      [name]: value,
    });
  };
  const handleSaveCountry = async () => {
    if ((!countryfield.name, !countryfield.dialCode)) {
      toast({
        title: "Please Fill all The Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/api/admin/allCountry/country`, {
        name: countryfield.name,
        description: countryfield.description,
        dial_code: countryfield.dialCode,
        iso_code: countryfield.isoCode,
      });
      setCountryfield({
        name: "",
        description: "",
        dialCode: "",
        isoCode: "",
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

  const getCountry = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/admin/allCountry/countries`);

      setCountry(data.country);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCountry = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/admin/allCountry/delete/${id}`
      );
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
    getCountry();
  }, [updateTable]);



   const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };


  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
        <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Country Module</h2>
          <Button className="addnew-btn" onClick={onOpen}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Country</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  type="text"
                  value={countryfield.name}
                  onChange={handleInputChange}
                  placeholder="Name*"
                  name="name"
                  className="property-input"
                />
                <input
                  type="text"
                  value={countryfield.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  name="description"
                  className="property-input"
                />
                <input
                  type="text"
                  value={countryfield.dialCode}
                  onChange={handleInputChange}
                  placeholder="Dial Code*"
                  name="dialCode"
                  className="property-input"
                />
                <input
                  type="text"
                  value={countryfield.isoCode}
                  onChange={handleInputChange}
                  placeholder="Iso Code"
                  name="isoCode"
                  className="property-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveCountry}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <TableContainer variant="striped" color="teal">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Dial Code</Th>
                  <Th>Edit</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td align="center" style={{ width: "50px" }}>
                      <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        style={{ position: "absolute", left: "482px" }}
                      />
                    </Td>
                  </Tr>
                ) : (
                  records?.map((countries) => (
                    <Tr key={countries._id} id={countries._id}>
                      <Td>{countries.name}</Td>
                      <Td>{countries.dial_code}</Td>
                      <Td>
                        <EditCountry
                          id={countries._id}
                          countries={countries}
                          setUpdateTable={setUpdateTable}
                          // handleFunction={() => handleEditCountry(countries._id)}
                        />
                      </Td>
                      <Td>
                        <Delete
                          handleFunction={() =>
                            handleDeleteCountry(countries._id)
                          }
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>

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

export default Country;