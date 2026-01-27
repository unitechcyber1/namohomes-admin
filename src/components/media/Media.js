import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { useToast } from "@chakra-ui/react";
import { BsBookmarkPlus } from "react-icons/bs";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import "./Media.css"
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
import ImageUpload from "../../ImageUpload";
import Delete from "../delete/Delete";
import BASE_URL from "../../apiConfig";
import { uploadFile, uploadImageFile } from "../../services/Services";
import Cookies from "js-cookie";
import { allImages, saveImage } from "./MediaService";
function Media() {
  const [updateTable, setUpdateTable] = useState(false);
  const [selectItemNum, setSelectItemNum] = useState(10);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [imagedata, setImagedata] = useState([]);
  const [searchedMedia, setSearchedMedia] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [media, setMedia] = useState({name: "", image: ""})
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? imagedata?.length : searchedMedia?.length) / recordsPerPage
  );

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleUploadFile = async (e) => {
    const files = Array.from(e.target.files);
    const data = await uploadImageFile(files, {setProgress: () => {}, setIsUploaded: () => {}, checkUrl: true});
    if(!data){
      toast({
        title: "Error Occured!",
        description: "Check your file extension",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return
    }
    setMedia((prev) => ({
      ...prev, 
      image: data[0]
    }))
  };
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setMedia({
      ...media,
      [name]: value,
    });
  }

  const handleSaveImage = async () => {
    if ((!media.name, !media.image)) {
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
      media.image = media.image._id
      await saveImage(media)
      onClose();
      setMedia({name: "", image: ""})
      setProgress(0);
      getImages()
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
    const filterMedia = imagedata.filter((image) => {
      const matchName =
        image.real_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(image.real_name.toLowerCase());

      return matchName;
    });
    setSearchedMedia(filterMedia);
    setCurPage(1);
  };

  useEffect(() => {
    // handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);
  const getImages = async () => {
    try {
      setLoading(true);
      const data = await allImages()
      setImagedata(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteImages = async (id) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/admin/image/delete/${id}`);
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
    getImages();
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
      (showAll ? imagedata.length : searchedMedia.length) / selectItemNum
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

  const uploadCancel = () => {
    setImages([]);
    setProgress(0);
    onClose();
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
              <ModalHeader>Upload New Image</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  type="text"
                  value={media.name}
                  onChange={handleInputChange}
                  placeholder="Name*"
                  name="name"
                  className="property-input"
                  required
                />
                {/* <ImageUpload
                  images={images}
                  setImages={setImages}
                  progress={progress}
                  setProgress={setProgress}
                  uploadFile={handleUploadFile}
                  isUploaded={isUploaded}
                /> */}
                  <div className="col-md-2">
                  <label className="file file_label">
                    <span className="upload_text">Upload</span>
                    <FaUpload className="upload_icon" />
                    <input
                      type="file"
                      aria-label="File browser example"
                      onChange={handleUploadFile}
                      className="file_hide"
                    />
                  </label>
                  <div
                    className="mt-3 d-flex align-items-center"
                  >
                    {(media.image || media.image?.s3_link) && <Fragment>
                      <img src={media.image?.s3_link} alt="media" width="50%" />
                    </Fragment>}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={uploadCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="ghost" onClick={handleSaveImage}>
                  Upload
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Media Module</div>
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
                  <Th>Image Link</Th>
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
                ) : 
                  (imagedata.map((image) => (
                      <Tr key={image._id} id={image._id}>
                        <Td>
                          {image?.name}
                        </Td>
                        <Td>{image?.image?.s3_link}</Td>
                        <Td>
                          <Delete
                            handleFunction={() => deleteImages(image._id)}
                          />
                        </Td>
                      </Tr>
                    ))
                )
                }
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
                  ? imagedata.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedMedia?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of {showAll ? imagedata?.length : searchedMedia.length}
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

export default Media;
