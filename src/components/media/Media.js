import React, { useEffect, useMemo, useState, Fragment } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
import { FaUpload } from "react-icons/fa";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button,
  useDisclosure, Spinner, useToast
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import { uploadImageFile } from "../../services/Services";

import {
  getAllMedia,
  createMedia,
  deleteMediaById,
  uploadFiles
} from "services/mediaService";

function Media() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);

  const [media, setMedia] = useState({ name: "", image: null });
  const [progress, setProgress] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  // ---------- Fetch ----------
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await getAllMedia();
      setMediaList(data);
    } catch {
      toast({ title: "Failed to load media", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [updateTable]);

  // ---------- Upload ----------
  // const handleUploadFile = async (e) => {
  //   const files = Array.from(e.target.files);

  //   const data = await uploadImageFile(files, {
  //     setProgress: () => { },
  //     setIsUploaded: () => { },
  //     checkUrl: true,
  //   });

  //   if (!data) {
  //     toast({
  //       title: "Invalid file type",
  //       status: "error",
  //     });
  //     return;
  //   }

  //   setMedia((p) => ({ ...p, image: data[0] }));
  // };
  const handleUploadFile = async (e) => {
  const files = Array.from(e.target.files);

  try {
    setProgress(0);

    const uploaded = await uploadFiles(files, {
      compressImages: true,
      onProgress: (percent) => setProgress(percent),
    });

    if (!uploaded || !uploaded.length) {
      toast({
        title: "Upload failed",
        status: "error",
      });
      return;
    }

    setMedia((prev) => ({
      ...prev,
      image: uploaded[0],
    }));

    setProgress(0);

  } catch (error) {
    toast({
      title: "Upload failed",
      description: error?.message || "Something went wrong",
      status: "error",
    });
  }
};


  // ---------- Save ----------
  const handleSave = async () => {
    if (!media.name || !media.image) {
      toast({ title: "Fill all fields", status: "warning" });
      return;
    }

    try {
      await createMedia({
        name: media.name,
        image: media.image._id,
      });

      toast({ title: "Uploaded", status: "success" });

      setMedia({ name: "", image: null });
      setProgress(0);
      onClose();
      setUpdateTable(p => !p);

    } catch (e) {
      toast({
        title: "Upload failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    try {
      await deleteMediaById(id);
      toast({ title: "Deleted", status: "success" });
      setUpdateTable(p => !p);
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  // ---------- Search ----------
  const filtered = useMemo(() => {
    if (!searchTerm) return mediaList;
    return mediaList.filter(m =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mediaList, searchTerm]);

  // ---------- Pagination ----------
  const totalPages = Math.ceil(filtered.length / perPage);
  const firstIndex = (curPage - 1) * perPage;
  const pageData = filtered.slice(firstIndex, firstIndex + perPage);

  const prePage = () => curPage > 1 && setCurPage(p => p - 1);
  const nextPage = () => curPage < totalPages && setCurPage(p => p + 1);

    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };

  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Media Module</h2>
        <Button className="addnew-btn mt-2" onClick={onOpen}>
          <BsBookmarkPlus /> ADD NEW
        </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload New Image</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <input
              name="name"
              value={media.name}
              onChange={(e) =>
                setMedia({ ...media, name: e.target.value })
              }
              placeholder="Name*"
              className="property-input"
            />

            <label className="file file_label mt-3">
              <span>Upload</span>
              <FaUpload />
              <input
                type="file"
                onChange={handleUploadFile}
                className="file_hide"
              />
            </label>

            {media.image?.s3_link && (
              <img
                src={media.image.s3_link}
                alt="preview"
                width="120"
                className="mt-3"
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Upload</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="row mt-2 project-card2">
        <div className="col-md-4 px-4">
          <input
            type="text"
            placeholder="Search by name"
            className="uniform-select-seo filter_row"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurPage(1);
            }}
          />
        </div>
      </div>
      
      <div className="table-box ">
              <TableContainer  overflowX="hidden">
                {/* Table */}
                <Table variant="simple" >
    <Thead bg="white">
      <Tr>
        <Th>Name</Th>
        <Th>Image Link</Th>
        <Th>Delete</Th>
      </Tr>
    </Thead>

    <Tbody>
      {loading ? (
        <Tr>
          <Td colSpan={3} textAlign="center">
            <Spinner size="xl" />
          </Td>
        </Tr>
      ) : (
        pageData.map((img) => (
          <Tr key={img._id}>
            <Td>{img.name}</Td>
            <Td>{img.image?.s3_link}</Td>
            <Td>
              <Delete handleFunction={() => handleDelete(img._id)} />
            </Td>
          </Tr>
        ))
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
  );
}

export default Media;
