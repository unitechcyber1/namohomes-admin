import React, { useEffect, useMemo, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Delete from "../delete/Delete";
import Select from "react-select";
import { BsBookmarkPlus } from "react-icons/bs";
import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Button, Spinner,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure,
  useToast
} from "@chakra-ui/react";

import {
  getStates,
  createState,
  deleteStateById
} from "services/stateService";

import { getCountries } from "services/countryService";

function State() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(null);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  /* ---------- Fetch ---------- */

  const fetchStates = async () => {
    try {
      setLoading(true);
      const data = await getStates();
      setStates(data);
    } catch {
      toast({ title: "Failed to load states", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    const data = await getCountries();
    setCountries(data);
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  /* ---------- Derived Data ---------- */

  const filteredStates = useMemo(() => {
    if (!search) return states;
    return states.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [states, search]);

  const perPageNum = Number(perPage);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStates.length / perPageNum)
  );

  const pageData = filteredStates.slice(
    (curPage - 1) * perPageNum,
    curPage * perPageNum
  );

  /* ---------- Handlers ---------- */

  const handleSave = async () => {
    if (!form.name || !selectedCountry) {
      toast({ title: "Name & Country required", status: "warning" });
      return;
    }

    try {
      await createState({
        name: form.name,
        description: form.description,
        country: selectedCountry.value,
      });

      toast({ title: "Saved", status: "success" });

      setForm({ name: "", description: "" });
      setSelectedCountry(null);
      onClose();
      fetchStates();

    } catch (e) {
      toast({
        title: "Save failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    await deleteStateById(id);
    toast({ title: "Deleted", status: "success" });
    fetchStates();
  };

  const countryOptions = countries.map(c => ({
    value: c._id,
    label: c.name,
  }));


    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };
  /* ---------- UI ---------- */

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      
       <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">City Module</h2>
      <Button className="addnew-btn mt-2" onClick={onOpen}>
        <BsBookmarkPlus /> ADD NEW
      </Button>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add State</ModalHeader>
          <ModalCloseButton />

          <ModalBody>

            <Select
              placeholder="Country"
              value={selectedCountry}
              options={countryOptions}
              onChange={setSelectedCountry}
            />

            <input
              className="property-input"
              placeholder="Name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="property-input"
              placeholder="Description"
              value={form.description}
              onChange={e =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />

          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Search */}
       <div className="row mt-2 project-card2">
        <div className="row ">
        <div className="col-md-4 px-4">
      <input
        className="uniform-select-seo"
        placeholder="Search state"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurPage(1);
        }}
      />
       </div>
        </div>

      </div>

      <div className="table-box ">
              <TableContainer  overflowX="hidden">
                {/* Table */}
                <Table variant="simple" >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Country</Th>
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
            ) : pageData.map(s => (
              <Tr key={s._id}>
                <Td>{s.name}</Td>
                <Td>{s.country?.name}</Td>
                <Td>
                  <Delete
                    handleFunction={() =>
                      handleDelete(s._id)
                    }
                  />
                </Td>
              </Tr>
            ))}
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

export default State;
