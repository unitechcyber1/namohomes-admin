import React, { useEffect, useMemo, useState } from "react";
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
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";
import { projectFormSelectStyles } from "../builder-projects/addBuilderProjects/projectFormSelectStyles";

import {
  getStates,
  createState,
  deleteStateById
} from "../../services/stateService";

import { getCountries } from "../../services/countryService";

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
    <>
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <SaasTableShell
          title="States"
          subtitle="Manage states linked to countries."
          actions={
            <Button className="addnew-btn" onClick={onOpen}>
              <BsBookmarkPlus /> ADD NEW
            </Button>
          }
          toolbar={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-[420px]">
                <label className="sr-only" htmlFor="stateSearch">
                  Search states
                </label>
                <input
                  id="stateSearch"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Search states…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurPage(1);
                  }}
                />
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
              onPrev={() => goToPage(curPage - 1)}
              onNext={() => goToPage(curPage + 1)}
              leftText={
                <span>
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredStates.length > 0 ? (curPage - 1) * perPageNum + 1 : 0}-
                    {Math.min(curPage * perPageNum, filteredStates.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredStates.length}
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
                  <Th>Country</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={3} textAlign="center">
                      <div className="py-10">
                        <Spinner />
                        <div className="mt-3 text-sm text-slate-500">
                          Loading states…
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : pageData.length ? (
                  pageData.map((s) => (
                    <Tr key={s._id} className="hover:bg-slate-50/60">
                      <Td className="font-medium text-slate-900">{s.name}</Td>
                      <Td>{s.country?.name || "-"}</Td>
                      <Td>
                        <div className="flex items-center justify-end">
                          <Delete handleFunction={() => handleDelete(s._id)} />
                        </div>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} textAlign="center">
                      <div className="mx-auto max-w-md py-14">
                        <div className="text-base font-semibold text-slate-900">
                          No states found
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Add a state to enable city setup for a country.
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
      </div>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10">
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">Add state</div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                Choose a country and create a state.
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody className="!px-6 !py-6">
            <div className="space-y-4">
              <div className="saas-field">
                <label className="saas-label">Country <span className="text-rose-600">*</span></label>
                <Select
                  placeholder="Select country"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={setSelectedCountry}
                  styles={projectFormSelectStyles}
                />
              </div>

              <div className="saas-field">
                <label className="saas-label" htmlFor="state-name-input">
                  State name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="state-name-input"
                  className="saas-input"
                  placeholder="e.g. Haryana"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="saas-field">
                <label className="saas-label" htmlFor="state-description-input">
                  Description
                </label>
                <input
                  id="state-description-input"
                  className="saas-input"
                  placeholder="Optional notes"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="!bg-rose-600 !text-white hover:!bg-rose-700" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default State;
