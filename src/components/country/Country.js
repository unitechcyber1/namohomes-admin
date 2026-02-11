import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { GpState } from "../../context/context";
import { useToast } from "@chakra-ui/react";
import { BsBookmarkPlus } from "react-icons/bs";

import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button,
  useDisclosure, Spinner
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import EditCountry from "./EditCountry";

import {
  getCountries,
  createCountry,
  deleteCountryById
} from "services/countryService";

function Country() {
  const toast = useToast();
  const { country, setCountry } = GpState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    dialCode: "",
    isoCode: "",
  });

  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  // ---------- Fetch ----------
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await getCountries();
      setCountry(data);
      setCurPage(1); // 🔥 reset page

    } catch {
      toast({
        title: "Failed to load countries",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [updateTable]);

  // ---------- Form ----------
  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------- Save ----------
  const handleSave = async () => {
    if (!form.name || !form.dialCode) {
      toast({ title: "Name & Dial Code required", status: "warning" });
      return;
    }

    try {
      await createCountry({
        name: form.name,
        description: form.description,
        dial_code: form.dialCode,
        iso_code: form.isoCode,
      });

      toast({ title: "Saved", status: "success" });

      setForm({
        name: "",
        description: "",
        dialCode: "",
        isoCode: "",
      });

      onClose();
      setUpdateTable(p => !p);

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
      await deleteCountryById(id);
      toast({ title: "Deleted", status: "success" });
      setUpdateTable(p => !p);
    } catch (e) {
      toast({
        title: "Delete failed",
        status: "error",
      });
    }
  };

  // ---------- Safe Array ----------
  const countryList = Array.isArray(country) ? country : [];

  // ---------- Pagination ----------
  const totalPages = Math.max(
    1,
    Math.ceil(countryList.length / perPage)
  );

  // 🔥 guard page overflow
  useEffect(() => {
    if (curPage > totalPages) setCurPage(1);
  }, [countryList.length, perPage]);

  const firstIndex = (curPage - 1) * perPage;
  const pageData = countryList.slice(
    firstIndex,
    firstIndex + perPage
  );

  const prePage = () =>
    curPage > 1 && setCurPage(p => p - 1);

  const nextPage = () =>
    curPage < totalPages && setCurPage(p => p + 1);
console.log(pageData)


  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };
  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
       <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Country Module</h2>
      <Button className="addnew-btn mt-2" onClick={onOpen}>
        <BsBookmarkPlus /> ADD NEW
      </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent> 
          <ModalHeader>Add Country</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {["name","description","dialCode","isoCode"].map(f => (
              <input
                key={f}
                name={f}
                value={form[f]}
                onChange={handleInputChange}
                placeholder={f}
                className="property-input"
              />
            ))}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="table-box ">
          <TableContainer  overflowX="hidden">
                {/* Table */}
        <Table variant="simple" >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Dial Code</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>

          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  <Spinner size="xl" />
                </Td>
              </Tr>
            ) : (
              pageData.map(c => (
                <Tr key={c._id}>
                  <Td>{c.name}</Td>
                  <Td>{c.dial_code}</Td>
                  <Td>
                    <EditCountry
                      id={c._id}
                      countries={c}
                      setUpdateTable={setUpdateTable}
                    />
                  </Td>
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

export default Country;
