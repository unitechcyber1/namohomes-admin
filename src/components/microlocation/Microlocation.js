import React, { useEffect, useMemo, useState } from "react";
import Delete from "../delete/Delete";
import ImageUpload from "../../ImageUpload";
import { AiFillEdit } from "react-icons/ai";
import Select from "react-select";
import { uploadFile } from "../../services/Services";
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";

import {
  getStatesByCountry,
  getCitiesByState,
  getMicrolocations,
  createMicrolocation,
  deleteMicrolocationById,
  updateMicrolocationById,
} from "../../services/microlocationService";
import { getCountries } from "../../services/countryService";

import {
  Button, Spinner, Table, Thead, Tbody,
  Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure,
  useToast
} from "@chakra-ui/react";
import { projectFormSelectStyles } from "../builder-projects/addBuilderProjects/projectFormSelectStyles";

function Microlocation() {

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingMicro, setEditingMicro] = useState(null);
  const [active, setActive] = useState(true);

  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  /* ---------- Fetch ---------- */

  const loadAll = async () => {
    setLoading(true);
    try {
      const [countryData, microData] = await Promise.all([
        getCountries(),
        getMicrolocations(),
      ]);
      setCountries(Array.isArray(countryData) ? countryData : []);
      setMicrolocations(Array.isArray(microData) ? microData : []);
    } catch (error) {
      toast({
        title: "Failed to load data",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setCountries([]);
      setMicrolocations([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadAll(); }, []);

  /* ---------- Cascading ---------- */

  const loadStatesForCountry = async (countryId) => {
    if (!countryId) {
      setStates([]);
      return [];
    }
    try {
      const data = await getStatesByCountry(countryId);
      const list = Array.isArray(data) ? data : [];
      setStates(list);
      return list;
    } catch (error) {
      toast({
        title: "Failed to load states",
        description:
          error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setStates([]);
      return [];
    }
  };

  const loadCitiesForState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return [];
    }
    try {
      const data = await getCitiesByState(stateId);
      const list = Array.isArray(data) ? data : [];
      setCities(list);
      return list;
    } catch (error) {
      toast({
        title: "Failed to load cities",
        description:
          error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setCities([]);
      return [];
    }
  };

  const handleCountry = async (opt) => {
    setSelectedCountry(opt);
    setSelectedState(null);
    setSelectedCity(null);
    if (!opt?.value) {
      setStates([]);
      setCities([]);
      return;
    }
    await loadStatesForCountry(opt.value);
  };

  const handleState = async (opt) => {
    setSelectedState(opt);
    setSelectedCity(null);
    if (!opt?.value) {
      setCities([]);
      return;
    }
    await loadCitiesForState(opt.value);
  };

  const handleClose = () => {
    setIsEdit(false);
    setEditingId(null);
    setEditingMicro(null);
    setActive(true);
    setForm({ name: "", description: "" });
    setImages([]);
    setProgress(0);
    setIsUploaded(false);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    onClose();
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setEditingMicro(null);
    setActive(true);
    setForm({ name: "", description: "" });
    setImages([]);
    setProgress(0);
    setIsUploaded(false);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    onOpen();
  };

  const handleOpenEdit = async (m) => {
    setIsEdit(true);
    setEditingId(m._id);
    setEditingMicro(m);
    setActive(!!m.active);
    setForm({ name: m.name || "", description: m.description || "" });
    setImages([]);
    setProgress(0);
    setIsUploaded(false);

    const cid = m.country?._id;
    const sid = m.state?._id;
    const cyid = m.city?._id;

    if (cid) {
      setSelectedCountry({ value: cid, label: m.country?.name || "" });
      const statesList = await loadStatesForCountry(cid);
      if (sid && statesList?.length) {
        const st = statesList.find((s) => s._id === sid);
        setSelectedState(st ? { value: st._id, label: st.name } : null);
        if (st) {
          const citiesList = await loadCitiesForState(sid);
          if (cyid && citiesList?.length) {
            const ct = citiesList.find((c) => c._id === cyid);
            setSelectedCity(ct ? { value: ct._id, label: ct.name } : null);
          } else {
            setSelectedCity(null);
          }
        }
      } else {
        setSelectedState(null);
        setCities([]);
        setSelectedCity(null);
      }
    } else {
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setStates([]);
      setCities([]);
    }
    onOpen();
  };

  /* ---------- Upload ---------- */

  const handleUpload = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, (d) =>
      setImages(prev => prev.concat(d))
    );
  };

  /* ---------- Save ---------- */

  const handleSave = async () => {
    if (!form.name || !selectedCountry?.value || !selectedState?.value || !selectedCity?.value) {
      toast({
        title: "Validation",
        description: "Please fill name, country, state and city.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      if (isEdit && editingId) {
        await updateMicrolocationById(editingId, {
          ...form,
          image: images.length ? images[0] : editingMicro?.image,
          country: selectedCountry.value,
          state: selectedState.value,
          city: selectedCity.value,
          active,
        });
        toast({
          title: "Updated",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        await createMicrolocation({
          ...form,
          image: images[0],
          country: selectedCountry.value,
          state: selectedState.value,
          city: selectedCity.value,
        });
        toast({
          title: "Saved",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      handleClose();
      loadAll();
    } catch (error) {
      toast({
        title: isEdit ? "Update failed" : "Save failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (id) => {
    try {
      await deleteMicrolocationById(id);
      toast({
        title: "Deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      loadAll();
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete microlocation. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  /* ---------- Derived ---------- */

  const filtered = useMemo(() =>
    !search ? microlocations :
    microlocations.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    ), [search, microlocations]
  );

  const perPageNum = Number(perPage);
  const pageData = filtered.slice(
    (curPage-1)*perPageNum,
    curPage*perPageNum
  );

  /* ---------- Options ---------- */

  const countryOptions = countries.map(c => ({value:c._id,label:c.name}));
  const stateOptions = states.map(s => ({value:s._id,label:s.name}));
  const cityOptions = cities.map(c => ({value:c._id,label:c.name}));

  /* ---------- UI ---------- */

  return (
    <>
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <SaasTableShell
            title="Locations (Microlocations)"
            subtitle="Manage microlocations linked to country, state, and city."
            actions={
              <Button className="addnew-btn" onClick={handleOpenAdd}>
                ADD NEW
              </Button>
            }
            toolbar={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-[420px]">
                  <label className="sr-only" htmlFor="microSearch">
                    Search locations
                  </label>
                  <input
                    id="microSearch"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                    placeholder="Search locations…"
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
                totalPages={Math.max(1, Math.ceil(filtered.length / perPageNum))}
                onPrev={() => setCurPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setCurPage((p) =>
                    Math.min(Math.max(1, Math.ceil(filtered.length / perPageNum)), p + 1)
                  )
                }
                leftText={
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {filtered.length > 0 ? (curPage - 1) * perPageNum + 1 : 0}-
                      {Math.min(curPage * perPageNum, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {filtered.length}
                    </span>
                  </span>
                }
              />
            }
          >
            <TableContainer>
              <Table className="min-w-[1040px]">
                <Thead className="bg-slate-50">
                  <Tr>
                    <Th>Name</Th>
                    <Th>Country</Th>
                    <Th>State</Th>
                    <Th>City</Th>
                    <Th>Status</Th>
                    <Th>Edit</Th>
                    <Th textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center">
                        <div className="py-10">
                          <Spinner />
                          <div className="mt-3 text-sm text-slate-500">
                            Loading locations…
                          </div>
                        </div>
                      </Td>
                    </Tr>
                  ) : pageData.length ? (
                    pageData.map((m) => (
                      <Tr key={m._id} className="hover:bg-slate-50/60">
                        <Td className="font-medium text-slate-900">{m.name}</Td>
                        <Td>{m.country?.name || "-"}</Td>
                        <Td>{m.state?.name || "-"}</Td>
                        <Td>{m.city?.name || "-"}</Td>
                        <Td>
                          <span className={m.active ? "status-pill approve" : "status-pill pending"}>
                            {m.active ? "Active" : "Inactive"}
                          </span>
                        </Td>
                        <Td>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                            aria-label="Edit location"
                            title="Edit"
                          >
                            <AiFillEdit />
                          </button>
                        </Td>
                        <Td>
                          <div className="flex items-center justify-end">
                            <Delete handleFunction={() => handleDelete(m._id)} />
                          </div>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7} textAlign="center">
                        <div className="mx-auto max-w-md py-14">
                          <div className="text-base font-semibold text-slate-900">
                            No locations found
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Try a different search, or add a new microlocation.
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
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10">
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">
                {isEdit ? "Edit location" : "Add location"}
              </div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                {isEdit
                  ? "Update hierarchy, details, image, and active status."
                  : "Set country, state, city, and microlocation details."}
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="!px-6 !py-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="saas-field">
                  <label className="saas-label">Country <span className="text-rose-600">*</span></label>
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountry}
                    placeholder="Country"
                    styles={projectFormSelectStyles}
                  />
                </div>
                <div className="saas-field">
                  <label className="saas-label">State <span className="text-rose-600">*</span></label>
                  <Select
                    options={stateOptions}
                    value={selectedState}
                    onChange={handleState}
                    placeholder="State"
                    styles={projectFormSelectStyles}
                  />
                </div>
                <div className="saas-field">
                  <label className="saas-label">City <span className="text-rose-600">*</span></label>
                  <Select
                    options={cityOptions}
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="City"
                    styles={projectFormSelectStyles}
                  />
                </div>
              </div>

              <div className="saas-field">
                <label className="saas-label" htmlFor="microlocation-name-input">
                  Location name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="microlocation-name-input"
                  placeholder="e.g. Sector 57"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div className="saas-field">
                <label className="saas-label" htmlFor="microlocation-description-input">
                  Description
                </label>
                <input
                  id="microlocation-description-input"
                  placeholder="Optional notes"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="saas-input"
                />
              </div>

              {isEdit && (
                <label
                  htmlFor="micro-active-checkbox"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/50 px-3 py-2.5"
                >
                  <input
                    id="micro-active-checkbox"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Active (visible in listings)
                  </span>
                </label>
              )}

              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Image
                </div>
                <ImageUpload
                  images={images}
                  setImages={setImages}
                  progress={progress}
                  setProgress={setProgress}
                  uploadFile={handleUpload}
                  isUploaded={isUploaded}
                />
                {isEdit && editingMicro?.image && images.length === 0 && (
                  <div className="mt-3">
                    <div className="mb-1 text-xs font-medium text-slate-500">Current image</div>
                    <img
                      src={editingMicro.image}
                      alt=""
                      className="max-h-40 max-w-full rounded-lg border border-slate-200 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button className="!bg-rose-600 !text-white hover:!bg-rose-700" onClick={handleSave}>
              {isEdit ? "Save changes" : "Create location"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Microlocation;
