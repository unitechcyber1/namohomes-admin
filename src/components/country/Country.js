import React, { useEffect, useState } from "react";
import { GpState } from "../../context/context";
import { useToast } from "@chakra-ui/react";
import { BsBookmarkPlus } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button,
  useDisclosure, Spinner
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";

import {
  getCountries,
  createCountry,
  deleteCountryById,
  updateCountryById,
} from "../../services/countryService";

const EMPTY_COUNTRY_FORM = {
  name: "",
  description: "",
  dialCode: "",
  isoCode: "",
};

function Country() {
  const toast = useToast();
  const { country, setCountry } = GpState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_COUNTRY_FORM });
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const handleClose = () => {
    setForm({ ...EMPTY_COUNTRY_FORM });
    setIsEdit(false);
    setEditingId(null);
    onClose();
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({ ...EMPTY_COUNTRY_FORM });
    onOpen();
  };

  const handleOpenEdit = (c) => {
    setIsEdit(true);
    setEditingId(c._id);
    setForm({
      name: c.name || "",
      description: c.description || "",
      dialCode: c.dial_code ?? "",
      isoCode: c.iso_code || "",
    });
    onOpen();
  };

  // ---------- Save (create or update) ----------
  const handleSave = async () => {
    if (!form.name || !form.dialCode) {
      toast({ title: "Name & Dial Code required", status: "warning" });
      return;
    }

    try {
      if (isEdit && editingId) {
        await updateCountryById(editingId, {
          name: form.name,
          description: form.description,
          dial_code: form.dialCode,
          iso_code: form.isoCode,
        });
        toast({ title: "Updated", status: "success" });
      } else {
        await createCountry({
          name: form.name,
          description: form.description,
          dial_code: form.dialCode,
          iso_code: form.isoCode,
        });
        toast({ title: "Saved", status: "success" });
      }

      handleClose();
      setUpdateTable((p) => !p);
    } catch (e) {
      toast({
        title: isEdit ? "Update failed" : "Save failed",
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


  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };
  // ---------- UI ----------
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <SaasTableShell
          title="Countries"
          subtitle="Manage countries used for state, city, and microlocation setup."
          actions={
            <Button className="addnew-btn" onClick={handleOpenAdd}>
              <BsBookmarkPlus /> ADD NEW
            </Button>
          }
          toolbar={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Total:{" "}
                <span className="font-semibold text-slate-900">
                  {countryList.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Per page
                </span>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none hover:border-slate-300 focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value) || 10);
                    setCurPage(1);
                  }}
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
          footer={
            <SaasPagination
              page={curPage}
              totalPages={totalPages}
              onPrev={prePage}
              onNext={nextPage}
              leftText={
                <span>
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {countryList.length > 0 ? firstIndex + 1 : 0}-
                    {Math.min(firstIndex + pageData.length, countryList.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {countryList.length}
                  </span>
                </span>
              }
            />
          }
        >
          <TableContainer>
            <Table className="min-w-[760px]">
              <Thead className="bg-slate-50">
                <Tr>
                  <Th>Name</Th>
                  <Th>Dial Code</Th>
                  <Th>Edit</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      <div className="py-10">
                        <Spinner />
                        <div className="mt-3 text-sm text-slate-500">
                          Loading countries…
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : pageData.length ? (
                  pageData.map((c) => (
                    <Tr key={c._id} className="hover:bg-slate-50/60">
                      <Td className="font-medium text-slate-900">{c.name}</Td>
                      <Td>{c.dial_code}</Td>
                      <Td>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                          aria-label="Edit country"
                          title="Edit"
                        >
                          <AiFillEdit />
                        </button>
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          <Delete
                            handleFunction={() => handleDelete(c._id)}
                          />
                        </div>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      <div className="mx-auto max-w-md py-14">
                        <div className="text-base font-semibold text-slate-900">
                          No countries found
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Add a country to start configuring states and cities.
                        </div>
                      </div>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </SaasTableShell>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10">
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">
                {isEdit ? "Edit country" : "Add country"}
              </div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                {isEdit
                  ? "Update dial code, ISO code, and other country details."
                  : "Create a country with dial and ISO code."}
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody className="!px-6 !py-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="saas-field">
                  <label className="saas-label" htmlFor="country-name-input">
                    Country name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="country-name-input"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. India"
                    className="saas-input"
                  />
                </div>
                <div className="saas-field">
                  <label className="saas-label" htmlFor="country-dial-input">
                    Dial code <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="country-dial-input"
                    name="dialCode"
                    value={form.dialCode}
                    onChange={handleInputChange}
                    placeholder="+91"
                    className="saas-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="saas-field">
                  <label className="saas-label" htmlFor="country-iso-input">
                    ISO code
                  </label>
                  <input
                    id="country-iso-input"
                    name="isoCode"
                    value={form.isoCode}
                    onChange={handleInputChange}
                    placeholder="IN"
                    className="saas-input"
                  />
                </div>
                <div className="saas-field">
                  <label className="saas-label" htmlFor="country-description-input">
                    Description
                  </label>
                  <input
                    id="country-description-input"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Optional notes"
                    className="saas-input"
                  />
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="!bg-rose-600 !text-white hover:!bg-rose-700" onClick={handleSave}>
              {isEdit ? "Save changes" : "Create country"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Country;
