import React, { useEffect, useState, useRef } from "react";
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

import { uploadFiles } from "../../services/mediaService";
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
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const filterRef = useRef({
    search: "",
    active: "all",
    limit: 10,
  });

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ---------- Fetch (server-side pagination) ----------
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const prev = filterRef.current;
      const filtersChanged =
        prev.search !== debouncedSearch ||
        prev.active !== activeFilter ||
        prev.limit !== perPage;

      if (filtersChanged) {
        filterRef.current = {
          search: debouncedSearch,
          active: activeFilter,
          limit: perPage,
        };
      }

      const pageToRequest = filtersChanged ? 1 : curPage;
      if (filtersChanged && curPage !== 1) {
        setCurPage(1);
      }

      try {
        setLoading(true);
        const res = await getClients({
          page: pageToRequest,
          limit: perPage,
          search: debouncedSearch || undefined,
          active: activeFilter,
        });
        if (cancelled) return;
        setClients(res.clients);
        setTotalPages(res.totalPages > 0 ? res.totalPages : 0);
        setTotalCount(res.totalCount ?? 0);
      } catch (e) {
        if (!cancelled) {
          toast({
            title: "Failed to load clients",
            description: e?.response?.data?.message || e?.message,
            status: "error",
          });
          setClients([]);
          setTotalPages(0);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [updateTable, curPage, perPage, debouncedSearch, activeFilter]);

  // ---------- Form ----------
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadFile = async (files) => {
    if (!files?.length) return;
    try {
      setIsUploaded(false);
      setProgress(0);
      const uploaded = await uploadFiles(files, {
        compressImages: true,
        onProgress: (percent) => setProgress(percent),
      });
      setImages((prev) => prev.concat(uploaded));
      setIsUploaded(true);
      setTimeout(() => setProgress(0), 3000);
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setProgress(0);
      setIsUploaded(false);
    }
  };

  // ---------- Create ----------
  const handleSaveClient = async () => {
    if (!form.name) {
      toast({ title: "Name required", status: "warning" });
      return;
    }

    try {
      const first = images[0];
      // Persist public image URL — API expects logo_url as the s3_link string from upload
      let logo_url;
      if (first == null) {
        logo_url = undefined;
      } else if (typeof first === "string") {
        logo_url = first;
      } else {
        const link = first.s3_link ?? first.url;
        logo_url = link && String(link).trim() !== "" ? link : undefined;
      }

      await createClient({
        name: form.name,
        logo_url,
      });

      toast({ title: "Saved Successfully!", status: "success" });

      setForm({ name: "" });
      setImages([]);
      setIsUploaded(false);
      setProgress(0);
      setCurPage(1);
      setUpdateTable((p) => !p);
      onClose();

    } catch (e) {
      toast({
        title: "Save failed",
        description: e?.response?.data?.message || e?.message,
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

  // ---------- Pagination (server-side; list is current page only) ----------
  const pageData = clients;
  const safeTotalPages = Math.max(totalPages, 1);
  const goToPage = (page) => {
    if (page < 1 || (totalPages > 0 && page > totalPages)) return;
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

      {/* Filters */}
      <div className="row mb-3 g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label small text-muted mb-1">Search</label>
          <input
            type="search"
            className="property-input w-100"
            placeholder="Search clients…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label small text-muted mb-1">Status</label>
          <select
            className="form-control custom-input-height w-100"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small text-muted mb-1">Per page</label>
          <select
            className="form-control custom-input-height w-100"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
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
                    <Td>
                      {c.logo_url && (
                        <img
                          src={
                            typeof c.logo_url === "string"
                              ? c.logo_url
                              : c.logo_url?.s3_link || c.logo_url?.url || ""
                          }
                          alt={c.name}
                          style={{ maxHeight: "40px", objectFit: "contain" }}
                        />
                      )}
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
            {totalCount > 0 ? (
              <>
                Page <strong>{curPage}</strong> of <strong>{safeTotalPages}</strong>
                {" · "}
                <strong>{totalCount}</strong> total
              </>
            ) : (
              <>No clients found</>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-2 pagination-controls">
            <button
              className="page-btn"
              type="button"
              disabled={curPage <= 1 || loading}
              onClick={() => goToPage(curPage - 1)}
            >
              Previous
            </button>

            <span className="current-page">
              {curPage}
            </span>

            <button
              className="page-btn"
              type="button"
              disabled={
                loading ||
                totalPages === 0 ||
                (totalPages > 0 && curPage >= totalPages)
              }
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
