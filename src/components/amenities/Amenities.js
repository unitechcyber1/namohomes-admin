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
import Delete from "../delete/Delete";
import { getAmenityById, getAmenities, updateAmenity, createAmenity, deleteAmenityById } from "../../services/amenityService";
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";

function Amenities() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amenity, setAmenity] = useState({ name: "", icon: "", isResidential: false, isCommercial: false })
  const [isLoading, setisLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [searchedAmenities, setSearchedAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [isEdit, setIsEdit] = useState(false)
  const [selectItemNum, setSelectItemNum] = useState(10);
  const [curPage, setCurPage] = useState(1);
  const toast = useToast();

  const handleSaveAmenities = async () => {
    try {
      if (isEdit) {
        await updateAmenity(amenity._id, amenity)
      } else {
        await createAmenity(amenity)
      }
      setAmenity({ name: "", icon: "", isResidential: false, isCommercial: false })
      onClose();
      getAmenitiesData();
      toast({
        title: isEdit ? "Update Successfully!" : "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message || "Failed to save amenity. Please check all fields and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setAmenity((prev) => {
      const updateAmenity = { ...prev };
      updateAmenity[name] = type === 'checkbox' ? checked : value
      return updateAmenity
    })
  }
  const getAmenitiesData = async () => {
    try {
      setisLoading(true);
      const data = await getAmenities();
      setAmenities(data);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      toast({
        title: "Error Loading Amenities",
        description: error.message || "Failed to load amenities. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGetAmenityById = async (id) => {
    try {
      const data = await getAmenityById(id)
      setAmenity(data);
      setIsEdit(true)
    } catch (error) {
      toast({
        title: "Error Loading Amenity",
        description: error.message || "Failed to load amenity details. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleClickEdit = (id) => {
    handleGetAmenityById(id)
    onOpen()
  }
  const handleClickAdd = () => {
    setIsEdit(false)
    setAmenity({ name: "", icon: "", isResidential: false, isCommercial: false })
    onOpen()
  }
  const handleDeleteAmenities = async (id) => {
    try {
      await deleteAmenityById(id);
      getAmenitiesData();
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message || "Failed to delete amenity. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = () => {
    const filteredAmenities = amenities.filter((amenity) => {
      const matchName =
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(amenity.name.toLowerCase());
      return matchName;
    });
    setSearchedAmenities(filteredAmenities);
    setCurPage(1);
  };
  useEffect(() => {
    getAmenitiesData();
  }, []);
  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [searchTerm]);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;

  const totalPages = Math.ceil(
    (showAll ? amenities.length : searchedAmenities.length) / selectItemNum
  );
  
    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };

  return (
    <>
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <SaasTableShell
            title="Amenities"
            subtitle="Create and manage amenities used across projects."
            actions={
              <Button
                className="addnew-btn"
                onClick={handleClickAdd}
              >
                <BsBookmarkPlus />
                ADD NEW
              </Button>
            }
            toolbar={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-[420px]">
                  <label className="sr-only" htmlFor="amenitySearch">
                    Search amenities
                  </label>
                  <input
                    id="amenitySearch"
                    type="text"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                    placeholder="Search amenities…"
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
                      {Math.min(lastIndex - recordsPerPage + 1, (showAll ? amenities.length : searchedAmenities.length) || 0)}
                      -
                      {Math.min(lastIndex, (showAll ? amenities.length : searchedAmenities.length) || 0)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {(showAll ? amenities.length : searchedAmenities.length) || 0}
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
                    <Th>Residential</Th>
                    <Th>Commercial</Th>
                    <Th textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLoading ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center">
                        <div className="py-10">
                          <Spinner />
                          <div className="mt-3 text-sm text-slate-500">
                            Loading amenities…
                          </div>
                        </div>
                      </Td>
                    </Tr>
                  ) : (
                    (showAll ? amenities : searchedAmenities)
                      .slice((curPage - 1) * selectItemNum, curPage * selectItemNum)
                      .map((a) => (
                        <Tr key={a._id} className="hover:bg-slate-50/60">
                          <Td className="font-medium text-slate-900">{a.name}</Td>
                          <Td>
                            <span className={a.isResidential ? "status-pill approve" : "status-pill pending"}>
                              {a.isResidential ? "Active" : "Inactive"}
                            </span>
                          </Td>
                          <Td>
                            <span className={a.isCommercial ? "status-pill approve" : "status-pill pending"}>
                              {a.isCommercial ? "Active" : "Inactive"}
                            </span>
                          </Td>
                          <Td>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleClickEdit(a._id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                                aria-label="Edit amenity"
                                title="Edit"
                              >
                                <AiFillEdit />
                              </button>
                              <Delete handleFunction={() => handleDeleteAmenities(a._id)} />
                            </div>
                          </Td>
                        </Tr>
                      ))
                  )}

                  {!isLoading &&
                    (showAll ? amenities : searchedAmenities).length === 0 && (
                      <Tr>
                        <Td colSpan={4} textAlign="center">
                          <div className="mx-auto max-w-md py-14">
                            <div className="text-base font-semibold text-slate-900">
                              No amenities found
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              Try a different search, or add a new amenity.
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent
          className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10"
          mx={{ base: 3, sm: "auto" }}
        >
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">
                {isEdit ? "Edit amenity" : "Add new amenity"}
              </div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                {isEdit
                  ? "Update the name, icon URL, and where this amenity applies."
                  : "Define a name, optional icon image URL, and project types."}
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton
            className="!rounded-lg !text-slate-500 hover:!bg-slate-100 hover:!text-slate-800"
            top={4}
            right={4}
          />
          <ModalBody className="!px-6 !py-6">
            <div className="space-y-5">
              <div className="saas-field">
                <label className="saas-label" htmlFor="amenity-name-input">
                  Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="amenity-name-input"
                  name="name"
                  value={amenity.name}
                  onChange={(e) => handleInputChange(e)}
                  type="text"
                  placeholder="e.g. Swimming pool"
                  autoComplete="off"
                  className="saas-input"
                />
              </div>
              <div className="saas-field">
                <label className="saas-label" htmlFor="amenity-icon-input">
                  Icon image URL
                </label>
                <input
                  id="amenity-icon-input"
                  name="icon"
                  value={amenity.icon}
                  onChange={(e) => handleInputChange(e)}
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  autoComplete="off"
                  className="saas-input font-mono text-[13px]"
                />
                <p className="saas-help">
                  Optional. Used when the amenity is shown with an icon on the
                  site.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applies to
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Choose which project types can use this amenity.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <label
                    htmlFor="amenity-is-residential"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80"
                  >
                    <input
                      id="amenity-is-residential"
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
                      type="checkbox"
                      name="isResidential"
                      onChange={(e) => handleInputChange(e)}
                      checked={!!amenity.isResidential}
                    />
                    <span className="text-sm font-medium text-slate-800">
                      Residential projects
                    </span>
                  </label>
                  <label
                    htmlFor="amenity-is-commercial"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80"
                  >
                    <input
                      id="amenity-is-commercial"
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
                      type="checkbox"
                      name="isCommercial"
                      onChange={(e) => handleInputChange(e)}
                      checked={!!amenity.isCommercial}
                    />
                    <span className="text-sm font-medium text-slate-800">
                      Commercial projects
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="!h-10 !min-w-[100px] !rounded-xl !border-slate-200 !bg-white !font-medium !text-slate-700 hover:!bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAmenities}
              className="!h-10 !min-w-[120px] !rounded-xl !bg-rose-600 !font-semibold !text-white hover:!bg-rose-700"
            >
              {isEdit ? "Save changes" : "Create amenity"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Amenities;
