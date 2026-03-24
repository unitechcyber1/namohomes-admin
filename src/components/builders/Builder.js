import React, { useEffect, useState, useRef } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Link } from "react-router-dom";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";

import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Spinner, useToast
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";

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
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Builder Module</h2>
      
        <Link to="/builder/add-builder" className="btnLink mt-2">
          <Addpropertybtn buttonText="ADD NEW" />
        </Link>
      </div>

      <div className="row mt-2 project-card2 align-items-end g-2">
        <div className="col-md-4 px-4">
          <input
            className="uniform-select-seo filter_row w-100"
            placeholder="Search by name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
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

      <div className="table-box ">
        
        <TableContainer overflowX="hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>

            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    <Spinner size="xl" />
                  </Td>
                </Tr>
              ) : pageData.length > 0 ? (
                pageData.map(b => (
                  <Tr key={b._id}>
                    <Td>{b.name?.toUpperCase()}</Td>

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
                      <Delete
                        handleFunction={() =>
                          handleDelete(b._id)
                        }
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>
                    No matching results found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <div className="d-flex justify-content-between align-items-center mt-4 pagination-bar">

          <div className="page-info">
            {totalCount > 0 ? (
              <>
                Page <strong>{curPage}</strong> of <strong>{safeTotalPages}</strong>
                {" · "}
                <strong>{totalCount}</strong> total
              </>
            ) : (
              <>No builders found</>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 pagination-controls">
            <button
              type="button"
              className="page-btn"
              disabled={curPage <= 1 || loading}
              onClick={() => goToPage(curPage - 1)}
            >
              Previous
            </button>

            <span className="current-page">
              {curPage}
            </span>

            <button
              type="button"
              className="page-btn"
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
};

export default Builder;
