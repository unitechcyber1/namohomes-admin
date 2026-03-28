import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";

import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Spinner, useToast
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";
import SaasTableShell from "../ui/SaasTableShell";
import SaasPagination from "../ui/SaasPagination";

import {
  getBuilders,
  deleteBuilderById
} from "../../services/builderService";

const Builder = () => {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const filterRef = useRef({ search: "", limit: 10 });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ---------- Fetch (server pagination: page, limit, optional search) ----------
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const prev = filterRef.current;
      const filtersChanged =
        prev.search !== debouncedSearch || prev.limit !== perPage;

      if (filtersChanged) {
        filterRef.current = { search: debouncedSearch, limit: perPage };
      }

      const pageToRequest = filtersChanged ? 1 : curPage;
      if (filtersChanged && curPage !== 1) {
        setCurPage(1);
      }

      try {
        setLoading(true);
        const res = await getBuilders({
          page: pageToRequest,
          limit: perPage,
          search: debouncedSearch || undefined,
        });
        if (cancelled) return;
        setBuilders(res.builders);
        setTotalCount(res.totalCount ?? 0);
        setTotalPages(res.totalPages ?? 0);
      } catch (e) {
        if (!cancelled) {
          toast({
            title: "Failed to load builders",
            description: e?.response?.data?.message || e?.message,
            status: "error",
          });
          setBuilders([]);
          setTotalCount(0);
          setTotalPages(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [curPage, perPage, debouncedSearch]);

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    try {
      await deleteBuilderById(id);
      toast({ title: "Deleted", status: "success" });
      // Refetch current page; if empty, user can go previous
      const res = await getBuilders({
        page: curPage,
        limit: perPage,
        search: debouncedSearch || undefined,
      });
      setBuilders(res.builders);
      setTotalCount(res.totalCount ?? 0);
      setTotalPages(res.totalPages ?? 0);
      if (res.builders.length === 0 && curPage > 1) {
        setCurPage((p) => Math.max(1, p - 1));
      }
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e?.response?.data?.message || e?.message,
        status: "error",
      });
    }
  };

  const pageData = builders;
  const safeTotalPages = totalCount > 0 ? Math.max(totalPages, 1) : 0;

  const goToPage = (page) => {
    if (page < 1) return;
    if (totalPages > 0 && page > totalPages) return;
    setCurPage(page);
  };

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <SaasTableShell
          title="Builders"
          subtitle="Manage builders and their profiles."
          actions={
            <Link to="/builder/add-builder" className="w-fit">
              <Addpropertybtn buttonText="ADD NEW" />
            </Link>
          }
          toolbar={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-[420px]">
                <label className="sr-only" htmlFor="builderSearch">
                  Search builders
                </label>
                <input
                  id="builderSearch"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  placeholder="Search builders…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Per page
                </span>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none hover:border-slate-300 focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value) || 10)}
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
              totalPages={safeTotalPages || 1}
              onPrev={() => goToPage(curPage - 1)}
              onNext={() => goToPage(curPage + 1)}
              leftText={
                totalCount > 0 ? (
                  <span>
                    Page <span className="font-semibold text-slate-900">{curPage}</span> of{" "}
                    <span className="font-semibold text-slate-900">{safeTotalPages}</span>
                    {" · "}
                    <span className="font-semibold text-slate-900">{totalCount}</span> total
                  </span>
                ) : (
                  <span>No builders found</span>
                )
              }
            />
          }
        >
          <TableContainer>
            <Table className="min-w-[920px]">
              <Thead className="bg-slate-50">
                <Tr>
                  <Th>Name</Th>
                  <Th>Description</Th>
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
                          Loading builders…
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : pageData.length > 0 ? (
                  pageData.map((b) => (
                    <Tr key={b._id} className="hover:bg-slate-50/60">
                      <Td className="font-medium text-slate-900">
                        {b.name?.toUpperCase()}
                      </Td>

                      <Td className="tableDescription">
                        {b?.seo?.description
                          ? b.seo.description.length > 50
                            ? b.seo.description.slice(0, 50) + "..."
                            : b.seo.description
                          : "Empty"}
                      </Td>

                      <Td>
                        <Link to={`/builder/edit-builder/${b._id}`}>
                          <AiFillEdit style={{ fontSize: 22 }} />
                        </Link>
                      </Td>

                      <Td>
                        <div className="flex items-center justify-end">
                          <Delete handleFunction={() => handleDelete(b._id)} />
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
                          Try a different search, or add a builder.
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
};

export default Builder;
