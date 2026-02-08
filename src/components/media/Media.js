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
  deleteMediaById
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
  const handleUploadFile = async (e) => {
    const files = Array.from(e.target.files);

    const data = await uploadImageFile(files, {
      setProgress: () => {},
      setIsUploaded: () => {},
      checkUrl: true,
    });

    if (!data) {
      toast({
        title: "Invalid file type",
        status: "error",
      });
      return;
    }

    setMedia((p) => ({ ...p, image: data[0] }));
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

  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <Button className="addnew-btn mt-2" onClick={onOpen}>
        <BsBookmarkPlus /> ADD NEW
      </Button>

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

      {/* Table */}
      <TableContainer mt="60px">
        <input
          placeholder="Search by name"
          className="form-control mb-3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurPage(1);
          }}
        />

        <Table>
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
                <Td colSpan={3} textAlign="center">
                  <Spinner size="xl" />
                </Td>
              </Tr>
            ) : (
              pageData.map(img => (
                <Tr key={img._id}>
                  <Td>{img.name}</Td>
                  <Td>{img.image?.s3_link}</Td>
                  <Td>
                    <Delete
                      handleFunction={() => handleDelete(img._id)}
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="mt-4 d-flex gap-3 align-items-center">
        <select
          value={perPage}
          onChange={e => {
            setPerPage(Number(e.target.value));
            setCurPage(1);
          }}
        >
          {[10,25,50,100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <BiSkipPrevious onClick={() => setCurPage(1)} />
        <GrFormPrevious onClick={prePage} />
        <GrFormNext onClick={nextPage} />
        <BiSkipNext onClick={() => setCurPage(totalPages)} />

        <span>
          {firstIndex + 1}–
          {Math.min(firstIndex + perPage, filtered.length)}
          of {filtered.length}
        </span>
      </div>
    </div>
  );
}

export default Media;
