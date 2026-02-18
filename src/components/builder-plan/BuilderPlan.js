import React, { useState, useEffect, useCallback } from "react";
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
  Spinner,
  Button,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Delete from "../delete/Delete";
import {
  getPropertyTypes,
  createPropertyType,
  deletePropertyTypeById,
} from "../../services/propertyTypeService";

function ResPropertyType() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [name, setName] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);

  const fetchPropertyTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPropertyTypes();
      setPropertyTypes(data);
    } catch (error) {
      // Error handled by service function
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSavePropertyType = async () => {
    try {
      await createPropertyType({ name });

      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setName("");
      onClose();
      setUpdateTable((prev) => !prev);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "Failed to save property type",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDeletePropertyType = async (id) => {
    try {
      await deletePropertyTypeById(id);

      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setUpdateTable((prev) => !prev);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "Failed to delete property type",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, [fetchPropertyTypes, updateTable]);

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Property Types</h2>
        <Button className="addnew-btn" onClick={onOpen}>
          <BsBookmarkPlus /> ADD NEW
        </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Property Type</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="property-input"
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={handleSavePropertyType}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Table */}
      <div className="table-box">
        <TableContainer >
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={2} textAlign="center">
                    <Spinner size="xl" />
                  </Td>
                </Tr>
              ) : (
                propertyTypes.map((type) => (
                  <Tr key={type._id}>
                    <Td>{type.name}</Td>
                    <Td>
                      <Delete
                        handleFunction={() =>
                          handleDeletePropertyType(type._id)
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
  );
}

export default ResPropertyType;
