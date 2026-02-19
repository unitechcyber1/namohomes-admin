import React, { useState, useContext } from "react";
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
import axios from "axios";
import { GpState } from "../../context/context";
import { AiFillEdit } from "react-icons/ai";
import BASE_URL from "../../apiConfig";
const EditCountry = ({ countries, setUpdateTable }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(countries.name);
  const [isoCode, setIsoCode] = useState(countries.iso_code);
  const [dialCode, setDialCode] = useState(countries.dial_code);
  const [countryId, setCountryId] = useState(countries._id);
  const [description, setDiscription] = useState(countries.description);
  const { country, setCountry } = GpState();
  const toast = useToast();

  const handleEditCountry = async () => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/allCountry/country/${countryId}`,
        {
          countryId: countryId,
          name: name,
          dial_code: dialCode,
        }
      );
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
      // Error handled by service function
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
