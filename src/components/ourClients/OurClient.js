import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";

import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button,
  useDisclosure, Spinner, useToast
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import ImageUpload from "../../ImageUpload";

import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

import { uploadFile } from "../../services/Services";
import {
  getClients,
  createClient,
  deleteClientById
} from "../../services/clientService";

function OurClient() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);

  const [form, setForm] = useState({ name: "" });

  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  // ---------- Fetch ----------
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients([...data].reverse());
    } catch (e) {
      toast({ title: "Failed to load clients", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [updateTable]);

  // ---------- Form ----------
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const previewFile = (data) => {
    setImages((prev) => prev.concat(data));
  };

  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };

  // ---------- Create ----------
  const handleSaveClient = async () => {
    if (!form.name) {
      toast({ title: "Name required", status: "warning" });
      return;
    }

    try {
      await createClient({
        name: form.name,
        logo_url: images[0],
      });

      toast({ title: "Saved Successfully!", status: "success" });

      setForm({ name: "" });
      setImages([]);
      setUpdateTable(p => !p);
      onClose();

    } catch (e) {
      toast({
        title: "Save failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    try {
      await deleteClientById(id);
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

  // ---------- Pagination ----------
  const totalPages = Math.ceil(clients.length / perPage);
  const firstIndex = (curPage - 1) * perPage;
  const pageData = clients.slice(firstIndex, firstIndex + perPage);

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
        <h2 className=" mb-0">Clients Module</h2>
        
        <Button className="addnew-btn" onClick={onOpen}>
          <BsBookmarkPlus /> ADD NEW
        </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Name*"
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
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button onClick={handleSaveClient}>Save</Button>
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
                <Th>Logo</Th>
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
                pageData.map(c => (
                  <Tr key={c._id}>
                    <Td>{c.name}</Td>
                    <Td>{c.logo_url}</Td>
                    <Td>
                      <Delete handleFunction={() => handleDelete(c._id)} />
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

export default OurClient;
