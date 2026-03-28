import React, { useState, useEffect } from "react";
import { BsBookmarkPlus } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
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
import { GpState } from "../../context/context";
import Delete from "../delete/Delete";
import Select from "react-select";
import {
  createCity,
  deleteCityById,
  getCities,
  updateCityById,
} from "../../services/cityService";
import { getCountries } from "../../services/countryService";
import { getStatesByCountry } from "../../services/microlocationService";
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";
import { projectFormSelectStyles } from "../builder-projects/addBuilderProjects/projectFormSelectStyles";

const EMPTY_CITY_FIELD = {
  name: "",
  description: "",
  country: "",
  state: "",
};

function City() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [cityfield, setCityfield] = useState({ ...EMPTY_CITY_FIELD });
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [active, setActive] = useState(true);
  const [searchedCity, setSearchedCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [states, setStates] = useState([]);
  const { country, setCountry } = GpState();

  const [selectItemNum, setSelectItemNum] = useState(10);

  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const totalPages = Math.ceil(
    (showAll ? cities.length : searchedCity?.length) / recordsPerPage
  );

  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCityfield({
      ...cityfield,
      [name]: value,
    });
  };

  const handleClose = () => {
    setCityfield({ ...EMPTY_CITY_FIELD });
    setSelectedCountry(null);
    setSelectedState(null);
    setStates([]);
    setIsEdit(false);
    setEditingId(null);
    setActive(true);
    onClose();
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setActive(true);
    setCityfield({ ...EMPTY_CITY_FIELD });
    setSelectedCountry(null);
    setSelectedState(null);
    setStates([]);
    onOpen();
  };

  const handleOpenEdit = async (city) => {
    setIsEdit(true);
    setEditingId(city._id);
    setActive(!!city.active);
    setCityfield({
      name: city.name || "",
      description: city.description || "",
      country: "",
      state: "",
    });
    const cid = city.country?._id;
    const sid = city.state?._id;
    if (cid) {
      setSelectedCountry({
        value: cid,
        label: city.country?.name || "",
      });
      const list = await handleFetchStates(cid);
      if (sid && list?.length) {
        const st = list.find((s) => s._id === sid);
        setSelectedState(
          st ? { value: st._id, label: st.name } : null
        );
      } else {
        setSelectedState(null);
      }
    } else {
      setSelectedCountry(null);
      setSelectedState(null);
      setStates([]);
    }
    onOpen();
  };

  const handleSaveCity = async () => {
    if (!selectedCountry?.value || !selectedState?.value) {
      toast({
        title: "Validation",
        description: "Please select country and state.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      if (isEdit && editingId) {
        await updateCityById(editingId, {
          name: cityfield.name,
          description: cityfield.description,
          country: selectedCountry.value,
          state: selectedState.value,
          active,
        });
        setSearchTerm("");
        toast({
          title: "Updated successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        await createCity({
          name: cityfield.name,
          description: cityfield.description,
          country: selectedCountry.value,
          state: selectedState.value,
        });
        toast({
          title: "Saved successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      handleClose();
      setUpdateTable((prev) => !prev);
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
  const handleSearch = () => {
    const filteredCity = cities.filter((city) => {
      const matchName =
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(city.name.toLowerCase());

      return matchName;
    });

    setSearchedCity(filteredCity);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);
  const handleFetchStates = async (countryId) => {
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

  const handleFetchCountry = async () => {
    try {
      const data = await getCountries();
      setCountry(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Failed to load countries",
        description:
          error?.response?.data?.message || error?.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleFetchCity = async () => {
    setLoading(true);
    try {
      const data = await getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Failed to load cities",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      await deleteCityById(id);
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
        title: "Delete failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete city. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    handleFetchCountry();
    handleFetchCity();
  }, [updateTable]);


  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "country":
        setSelectedCountry(selectedOption);
        setSelectedState(null);
        handleFetchStates(selectedOption ? selectedOption.value : null);
        break;
      case "state":
        setSelectedState(selectedOption);
        break;

      default:
        break;
    }
  };
  const stateOptions = states?.map((state) => ({
    value: state._id,
    label: state.name,
  }));
  const countryOptions = country?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };
  return (
    <>
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <SaasTableShell
            title="Cities"
            subtitle="Create and manage cities linked to countries and states."
            actions={
              <Button className="addnew-btn" onClick={handleOpenAdd}>
                <BsBookmarkPlus />
                ADD NEW
              </Button>
            }
            toolbar={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-[420px]">
                  <label className="sr-only" htmlFor="citySearch">
                    Search cities
                  </label>
                  <input
                    id="citySearch"
                    type="text"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                    placeholder="Search cities…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Per page
                  </span>
                  <select
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none hover:border-slate-300 focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                    value={selectItemNum}
                    onChange={(e) => {
                      setSelectItemNum(Number(e.target.value) || 10);
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
                totalPages={totalPages || 1}
                onPrev={() => goToPage(curPage - 1)}
                onNext={() => goToPage(curPage + 1)}
                leftText={
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {Math.min(firstIndex + 1, (showAll ? cities.length : searchedCity.length) || 0)}-
                      {Math.min(lastIndex, (showAll ? cities.length : searchedCity.length) || 0)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {(showAll ? cities.length : searchedCity.length) || 0}
                    </span>
                  </span>
                }
              />
            }
          >
            <TableContainer>
              <Table className="min-w-[920px]">
                <Thead className="bg-slate-50">
                  <Tr>
                    <Th>Name</Th>
                    <Th>Country</Th>
                    <Th>State</Th>
                    <Th>Status</Th>
                    <Th>Edit</Th>
                    <Th textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        <div className="py-10">
                          <Spinner />
                          <div className="mt-3 text-sm text-slate-500">
                            Loading cities…
                          </div>
                        </div>
                      </Td>
                    </Tr>
                  ) : (
                    (showAll ? cities : searchedCity)
                      .slice((curPage - 1) * selectItemNum, curPage * selectItemNum)
                      .map((city) => (
                        <Tr key={city._id} className="hover:bg-slate-50/60">
                          <Td className="font-medium text-slate-900">{city.name}</Td>
                          <Td>{city.country?.name || "-"}</Td>
                          <Td>{city.state?.name || "-"}</Td>
                          <Td>
                            <span className={city.active ? "status-pill approve" : "status-pill pending"}>
                              {city.active ? "Active" : "Inactive"}
                            </span>
                          </Td>
                          <Td>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(city)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                              aria-label="Edit city"
                              title="Edit"
                            >
                              <AiFillEdit />
                            </button>
                          </Td>
                          <Td>
                            <div className="flex items-center justify-end">
                              <Delete handleFunction={() => handleDeleteCity(city._id)} />
                            </div>
                          </Td>
                        </Tr>
                      ))
                  )}

                  {!loading && (showAll ? cities : searchedCity).length === 0 && (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        <div className="mx-auto max-w-md py-14">
                          <div className="text-base font-semibold text-slate-900">
                            No cities found
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Try a different search, or add a new city.
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

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10">
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">
                {isEdit ? "Edit city" : "Add city"}
              </div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                {isEdit
                  ? "Update country, state, name, description, and active status."
                  : "Select country and state, then create the city."}
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="!px-6 !py-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="saas-field">
                  <label className="saas-label">Country <span className="text-rose-600">*</span></label>
                <Select
                  placeholder="Select country"
                  value={selectedCountry}
                  options={countryOptions}
                  onChange={(selectedOption) =>
                    onChangeOptionHandler(selectedOption, "country")
                  }
                  isSearchable
                  required
                  styles={projectFormSelectStyles}
                />
                </div>
                <div className="saas-field">
                  <label className="saas-label">State <span className="text-rose-600">*</span></label>
                <Select
                  placeholder="Select state"
                  value={selectedState}
                  options={stateOptions}
                  onChange={(selectedOption) =>
                    onChangeOptionHandler(selectedOption, "state")
                  }
                  isSearchable
                  required
                  styles={projectFormSelectStyles}
                />
                </div>
              </div>

              <div className="saas-field">
                <label className="saas-label" htmlFor="city-name-input">
                  City name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="city-name-input"
                  name="name"
                  value={cityfield.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="e.g. Gurugram"
                  className="saas-input"
                />
              </div>
              <div className="saas-field">
                <label className="saas-label" htmlFor="city-description-input">
                  Description
                </label>
                <input
                  id="city-description-input"
                  name="description"
                  value={cityfield.description}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Optional notes"
                  className="saas-input"
                />
              </div>

              {isEdit && (
                <label
                  htmlFor="city-active-checkbox"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/50 px-3 py-2.5"
                >
                  <input
                    id="city-active-checkbox"
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
            </div>
          </ModalBody>
          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="!bg-rose-600 !text-white hover:!bg-rose-700" onClick={handleSaveCity}>
              {isEdit ? "Save changes" : "Create city"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default City;
