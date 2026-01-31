import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
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
import Delete from "../delete/Delete";
import BASE_URL from "../../apiConfig";
function ResPropertyType() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [updateTable, setUpdateTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [propertyTypes, setPropertyTypes] = useState([]);
  const toast = useToast();

  const handleSavePropertyTypes = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/admin/propertyTypes`,
        {
          name: name,
        }
      );  
      setName("");
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

  const getPropertyTypes = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${BASE_URL}/api/admin/propertyTypes`
      );
      setPropertyTypes(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
 
  const handleDeletePropertyTypes = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/admin/propertyType/delete/${id}`
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
    getPropertyTypes();
  }, [updateTable]);
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
              <ModalHeader>Add New Plan</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSavePropertyTypes}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Builder Plans Module</div>
          <TableContainer marginTop="60px" variant="striped" color="teal">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
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
                ) : (
                  propertyTypes?.map((types) => (
                    <Tr key={types._id} id={types._id}>
                      <Td>{types.name}</Td>
                      <Td>
                        <Delete
                          handleFunction={() =>
                            handleDeletePropertyTypes(types._id)
                          }
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default ResPropertyType;
