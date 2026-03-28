import React, { useEffect, useMemo, useState, Fragment } from "react";
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
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";

import {
  getAllMedia,
  createMedia,
  deleteMediaById,
  uploadFiles
} from "../../services/mediaService";

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

  try {
    setProgress(0);

    const uploaded = await uploadFiles(files, {
      compressImages: true,
      onProgress: (percent) => setProgress(percent),
    });

    if (!uploaded || !uploaded.length) {
      toast({
        title: "Upload failed",
        status: "error",
      });
      return;
    }

    setMedia((prev) => ({
      ...prev,
      image: uploaded[0],
    }));

    setProgress(0);

  } catch (error) {
    toast({
      title: "Upload failed",
      description: error?.message || "Something went wrong",
      status: "error",
    });
  }
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

    const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };

  // ---------- UI ----------
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <SaasTableShell
          title="Media"
          subtitle="Upload and manage media assets."
          actions={
            <Button className="addnew-btn" onClick={onOpen}>
              <BsBookmarkPlus />
              ADD NEW
            </Button>
          }
          toolbar={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-[420px]">
                <label className="sr-only" htmlFor="mediaSearch">
                  Search media
                </label>
                <input
                  id="mediaSearch"
                  type="text"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Search media…"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
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
              totalPages={totalPages || 1}
              onPrev={() => goToPage(curPage - 1)}
              onNext={() => goToPage(curPage + 1)}
              leftText={
                <span>
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(firstIndex + 1, filtered.length || 0)}-
                    {Math.min(firstIndex + pageData.length, filtered.length || 0)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {filtered.length || 0}
                  </span>
                </span>
              }
            />
          }
        >
          <TableContainer>
            <Table className="min-w-[860px]">
              <Thead className="bg-slate-50">
                <Tr>
                  <Th>Name</Th>
                  <Th>Image Link</Th>
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
                          Loading media…
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : pageData.length ? (
                  pageData.map((img) => (
                    <Tr key={img._id} className="hover:bg-slate-50/60">
                      <Td className="font-medium text-slate-900">{img.name}</Td>
                      <Td className="tableDescription">{img.image?.s3_link}</Td>
                      <Td>
                        <div className="flex items-center justify-end">
                          <Delete handleFunction={() => handleDelete(img._id)} />
                        </div>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} textAlign="center">
                      <div className="mx-auto max-w-md py-14">
                        <div className="text-base font-semibold text-slate-900">
                          No media found
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Upload a new asset to get started.
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(6px)" />
        <ModalContent className="!m-4 overflow-hidden rounded-2xl border border-slate-200/90 !bg-white shadow-2xl shadow-slate-900/10">
          <ModalHeader className="!border-b !border-slate-100 !bg-slate-50/80 !px-6 !pb-4 !pt-6">
            <div className="pr-8">
              <div className="text-lg font-semibold tracking-tight text-slate-900">Upload media</div>
              <p className="mt-1 text-sm font-normal text-slate-500">
                Add an asset name and upload one image file.
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody className="!px-6 !py-6">
            <div className="space-y-5">
              <div className="saas-field">
                <label className="saas-label" htmlFor="media-name-input">
                  Media name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="media-name-input"
                  name="name"
                  value={media.name}
                  onChange={(e) => setMedia({ ...media, name: e.target.value })}
                  placeholder="e.g. Hero banner"
                  className="saas-input"
                />
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  File upload
                </div>
                <label className="file file_label mt-2">
                  <span>Choose file</span>
                  <FaUpload />
                  <input type="file" onChange={handleUploadFile} className="file_hide" />
                </label>
              </div>

              {media.image?.s3_link && (
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 text-xs font-medium text-slate-500">Preview</div>
                  <img
                    src={media.image.s3_link}
                    alt="preview"
                    width="140"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="!gap-3 !border-t !border-slate-100 !bg-slate-50/60 !px-6 !py-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="!bg-rose-600 !text-white hover:!bg-rose-700" onClick={handleSave}>
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Media;
