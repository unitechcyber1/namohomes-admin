import React, { useCallback, useEffect, useRef, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
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
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">SEO Module</h2>
        <Link to={`${baseSeoPath}/add-seo`} className="btnLink mt-2">
          <Addpropertybtn buttonText="ADD NEW" />
        </Link>
      </div>

      <div className="row mt-2 project-card2">
        <div className="row ">
          <div className="col-md-4 px-4">
            <input
              type="text"
              className="uniform-select-seo"
              placeholder="Search by Path"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search by path"
            />
          </div>
        </div>

      </div>

      <div className="table-box ">
        <TableContainer  overflowX="hidden">
          {/* Table */}
          <Table variant="simple" >
            <Thead>
              <Tr>
                <Th>Path</Th>
                <Th>Title</Th>
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
              ) : seos.length > 0 ? (
                seos.map((seo) => (
                  <Tr key={seo._id}>
                    <Td>{seo.path}</Td>
                    <Td>
                      {seo.title?.length > 35
                        ? seo.title.substring(0, 35) + "..."
                        : seo.title}
                    </Td>

                    <Td>
                      <Link
                        to={`${baseSeoPath}/editseo/${seo._id}`}
                        target="_blank"
                      >
                        <AiFillEdit
                          style={{ fontSize: 22, cursor: "pointer" }}
                        />
                      </Link>
                    </Td>

                    <Td>
                      <Delete
                        handleFunction={() =>
                          handleDeleteSeo(seo._id)
                        }
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>No matching results found.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4 pagination-bar flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="page-info">
              Showing <strong>{firstIndex}-{lastIndex}</strong> of <strong>{totalCount}</strong> SEO entries
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 small">Per page:</label>
              <select
                className="uniform-select2"
                style={{ width: "auto", minWidth: "70px" }}
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
          <div className="d-flex align-items-center gap-2 pagination-controls">
            <button
              className="page-btn"
              disabled={curPage <= 1 || totalPages === 0}
              onClick={() => goToPage(curPage - 1)}
            >
              Previous
            </button>
            <span className="current-page">
              Page {curPage} of {totalPages || 1}
            </span>
            <button
              className="page-btn"
              disabled={curPage >= totalPages || totalPages === 0}
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

export default Seo;
