import React, { useState } from "react";
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
import { GpState } from "../../context/context";
import { AiFillEdit } from "react-icons/ai";
import { updateCountryById } from "../../services/countryService";

const EditCountry = ({ countries, setUpdateTable }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(countries.name);
  const [isoCode, setIsoCode] = useState(countries.iso_code);
  const [dialCode, setDialCode] = useState(countries.dial_code);
  const [countryId] = useState(countries._id);
  const [description, setDiscription] = useState(countries.description);
  const { setCountry } = GpState();
  const toast = useToast();

  const handleEditCountry = async () => {
    try {
      const data = await updateCountryById(countryId, {
        name,
        dial_code: dialCode,
        description,
        iso_code: isoCode,
      });
      setCountry(data.country);
      setUpdateTable((prev) => !prev);
      onClose();
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <>
      <AiFillEdit
        onClick={onOpen}
        style={{ fontSize: "22px", cursor: "pointer" }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              name="name"
              className="property-input"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDiscription(e.target.value)}
              placeholder="Description"
              name="description"
              className="property-input"
            />
            <input
              type="text"
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
              placeholder="Dial Code"
              name="dialCode"
              className="property-input"
            />
            <input
              type="text"
              value={isoCode}
              onChange={(e) => setIsoCode(e.target.value)}
              placeholder="Iso Code"
              name="isoCode"
              className="property-input"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleEditCountry}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCountry;
