import React, { useState, useEffect, useCallback } from "react";
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
import SaasTableShell from "../ui/SaasTableShell";

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
    <>
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <SaasTableShell
            title="Project Types"
            subtitle="Manage project/property type options used in project creation."
            actions={
              <Button className="addnew-btn" onClick={onOpen}>
                <BsBookmarkPlus /> ADD NEW
              </Button>
            }
          >
            <TableContainer>
              <Table className="min-w-[640px]">
                <Thead className="bg-slate-50">
                  <Tr>
                    <Th>Name</Th>
                    <Th textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={2} textAlign="center">
                        <div className="py-10">
                          <Spinner />
                          <div className="mt-3 text-sm text-slate-500">
                            Loading types…
                          </div>
                        </div>
                      </Td>
                    </Tr>
                  ) : propertyTypes.length ? (
                    propertyTypes.map((type) => (
                      <Tr key={type._id} className="hover:bg-slate-50/60">
                        <Td className="font-medium text-slate-900">{type.name}</Td>
                        <Td>
                          <div className="flex items-center justify-end">
                            <Delete
                              handleFunction={() =>
                                handleDeletePropertyType(type._id)
                              }
                            />
                          </div>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={2} textAlign="center">
                        <div className="mx-auto max-w-md py-14">
                          <div className="text-base font-semibold text-slate-900">
                            No types found
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Add a type to enable selection during project creation.
                          </div>
                        </div>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </SaasTableShell>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10">
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">Add project type</div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                Create a property type for project forms.
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="!px-6 !py-6">
            <div className="saas-field">
              <label className="saas-label" htmlFor="property-type-name-input">
                Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="property-type-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. Apartment"
                className="saas-input"
              />
            </div>
          </ModalBody>
          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="!bg-rose-600 !text-white hover:!bg-rose-700" onClick={handleSavePropertyType}>
              Create type
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ResPropertyType;
