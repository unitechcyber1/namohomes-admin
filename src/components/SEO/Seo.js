import React, { useCallback, useEffect, useRef, useState } from "react";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import { Link } from "react-router-dom";
import "./Seo.css";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";

import { getSeoListPaginated, deleteSeoById } from "../../services/seoService";
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const SEARCH_DEBOUNCE_MS = 400;

function Seo() {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [seos, setSeos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [curPage, setCurPage] = useState(1);
  const debounceTimerRef = useRef(null);

  const baseSeoPath = "/seo";

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const firstIndex = totalCount > 0 ? (curPage - 1) * limit + 1 : 0;
  const lastIndex = Math.min(curPage * limit, totalCount);

  const fetchSeos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: curPage,
        limit,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      };
      const data = await getSeoListPaginated(params);
      const list = Array.isArray(data) ? data : data?.data ?? data?.seos ?? [];
      const count = data?.totalCount ?? data?.total ?? list.length;
      setSeos(list);
      setTotalCount(count);
    } catch (err) {
      toast({
        title: "Failed to load SEO data",
        description: err?.response?.data?.message || err?.message || "Unable to load SEO data. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setSeos([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [curPage, limit, debouncedSearch, toast]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchSeos();
  }, [fetchSeos, updateTable]);

  const handleDeleteSeo = async (id) => {
    try {
      await deleteSeoById({ id });
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setUpdateTable((p) => !p);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error?.response?.data?.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const goToPage = (page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurPage(pageNum);
  };

  const handlePageSizeChange = (e) => {
    const newLimit = Number(e.target.value) || 20;
    setLimit(newLimit);
    setCurPage(1);
  };


  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <SaasTableShell
          title="SEO"
          subtitle="Manage SEO pages and metadata."
          actions={
            <Link to={`${baseSeoPath}/add-seo`} className="w-fit">
              <Addpropertybtn buttonText="ADD NEW" />
            </Link>
          }
          toolbar={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-[420px]">
                <label className="sr-only" htmlFor="seoSearch">
                  Search SEO
                </label>
                <input
                  id="seoSearch"
                  type="text"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Search by path…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search by path"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Per page
                </span>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none hover:border-slate-300 focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  value={limit}
                  onChange={handlePageSizeChange}
                  aria-label="Items per page"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
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
                    {firstIndex}-{lastIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {totalCount}
                  </span>
                </span>
              }
            />
          }
        >
          <TableContainer>
            <Table className="min-w-[980px]">
              <Thead className="bg-slate-50">
                <Tr>
                  <Th>Path</Th>
                  <Th>Title</Th>
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
                          Loading SEO…
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : seos.length > 0 ? (
                  seos.map((seo) => (
                    <Tr key={seo._id} className="hover:bg-slate-50/60">
                      <Td className="tableDescription">{seo.path}</Td>
                      <Td className="font-medium text-slate-900">
                        {seo.title?.length > 35
                          ? seo.title.substring(0, 35) + "..."
                          : seo.title}
                      </Td>

                      <Td>
                        <Link to={`${baseSeoPath}/editseo/${seo._id}`} target="_blank">
                          <AiFillEdit style={{ fontSize: 22, cursor: "pointer" }} />
                        </Link>
                      </Td>

                      <Td>
                        <div className="flex items-center justify-end">
                          <Delete handleFunction={() => handleDeleteSeo(seo._id)} />
                        </div>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      <div className="mx-auto max-w-md py-14">
                        <div className="text-base font-semibold text-slate-900">
                          No matching results found
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Try a different search, or add a new SEO entry.
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
  );
}

export default Seo;
