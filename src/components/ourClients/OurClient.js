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
import "./OurClient.css";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import BASE_URL from "../../apiConfig";
import ImageUpload from "../../ImageUpload";
import { uploadFile } from "../../services/Services";
function OurClient() {
  const [ourClient, setOurClient] = useState([]);
  const [ourClientField, setOurClientField] = useState({
    name: "",
    logo_url: "",
  });
  const [updateTable, setUpdateTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectItemNum, setSelectItemNum] = useState(10);
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = ourClient?.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(ourClient?.length / recordsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOurClientField({
      ...ourClientField,
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
  const handleSaveOurClient = async () => {
    if (!ourClientField.name) {
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
      const { data } = await axios.post(`${BASE_URL}/api/admin/client`, {
        name: ourClientField.name,
        logo_url: images[0],
      });
      setOurClientField({
        name: "",
        logo_url: "",
      });
      setImages([]);
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
        description: "Failed to Save Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const getOurClients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/admin/clients`);
      const newData = data.reverse();
      setOurClient(newData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/admin/client/delete/${id}`
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
    getOurClients();
  }, [updateTable]);

  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  if (records?.length === selectItemNum) {
    var nextPage = () => {
      if (curPage !== lastIndex) {
        setCurPage(curPage + 1);
      }
    };
  }

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
          <Button className="addnew-btn" onClick={onOpen}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Client</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  type="text"
                  value={ourClientField.name}
                  onChange={handleInputChange}
                  placeholder="Name*"
                  name="name"
                  className="property-input"
                />
                <ImageUpload
                  images={images}
                  setImages={setImages}
                  progress={progress}
                  setProgress={setProgress}
                  uploadFile={handleUploadFile}
                  isUploaded={isUploaded}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveOurClient}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Client Module</div>
          <TableContainer marginTop="60px" variant="striped" color="teal">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Logo Url</Th>
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
                  records?.map((client) => (
                    <Tr key={client._id} id={client._id}>
                      <Td>{client.name}</Td>
                      <Td>{client.logo_url}</Td>

                      <Td>
                        <Delete
                          handleFunction={() => handleDeleteClient(client._id)}
                        />
                      </Td>
                    </Tr>
                  ))
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
                {firstIndex + 1} - {records?.length + firstIndex} of{" "}
                {ourClient?.length}
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

export default OurClient;
