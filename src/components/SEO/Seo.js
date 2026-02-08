import React, { useEffect, useMemo, useState } from "react";
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
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

import { getSeoList, deleteSeoById } from "services/seoService";

function Seo() {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [seos, setSeos] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectItemNum, setSelectItemNum] = useState(10);
  const [curPage, setCurPage] = useState(1);

  const isDwarka = window.location.href.includes("dwarkaexpressway");
  const baseSeoPath = isDwarka ? "/dwarkaexpressway/seo" : "/seo";

  // ✅ Fetch SEO list
  const handleFetchSeo = async () => {
    try {
      setLoading(true);
      const data = await getSeoList();
      setSeos([...data].reverse());
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to load SEO data",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSeo();
  }, [updateTable]);

  // ✅ Delete SEO
  const handleDeleteSeo = async (id) => {
    try {
      await deleteSeoById({
        id,
        type: isDwarka ? "dwarka" : "default",
      });

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
        description: error.response?.data?.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // ✅ Derived filtered data (scalable)
  const filteredSeos = useMemo(() => {
    if (!searchTerm) return seos;
    return seos.filter((seo) =>
      seo.path?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [seos, searchTerm]);

  // ✅ Pagination calculations
  const recordsPerPage = Number(selectItemNum);
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const totalPages = Math.ceil(filteredSeos.length / recordsPerPage);

  const pageData = filteredSeos.slice(firstIndex, lastIndex);

  // ✅ Pagination handlers
  const prePage = () => {
    if (curPage > 1) setCurPage((p) => p - 1);
  };

  const nextPage = () => {
    if (curPage < totalPages) setCurPage((p) => p + 1);
  };

  const getFirstPage = () => setCurPage(1);
  const getLastPage = () => setCurPage(totalPages);

  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
    setCurPage(1);
  };

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <Link to={`${baseSeoPath}/add-seo`} className="btnLink mt-2">
        <Addpropertybtn buttonText="ADD NEW" />
      </Link>

      <div className="table-box space-table-box">
        <div className="table-top-box">SEO Module</div>

        <TableContainer marginTop="60px" overflowX="hidden">
          {/* Search */}
          <div className="row">
            <div className="col-md-3">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Path"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurPage(1);
                  }}
                />
                <label>Search by Path</label>
              </div>
            </div>
          </div>

          {/* Table */}
          <Table variant="simple" marginTop="20px">
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
              ) : pageData.length > 0 ? (
                pageData.map((seo) => (
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
        <nav className="mt-5">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "51%" }}
          >
            <p className="mb-0">Items per page:</p>

            <select
              className="form-select"
              value={selectItemNum}
              onChange={itemsPerPageHandler}
              style={{ width: 100 }}
            >
              {[10, 20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div style={{ width: 140 }}>
              {filteredSeos.length === 0
                ? "0"
                : `${firstIndex + 1}-${Math.min(
                    lastIndex,
                    filteredSeos.length
                  )}`}{" "}
              of {filteredSeos.length}
            </div>

            <div className="page-item">
              <BiSkipPrevious onClick={getFirstPage} />
            </div>
            <div className="page-item">
              <GrFormPrevious onClick={prePage} />
            </div>
            <div className="page-item">
              <GrFormNext onClick={nextPage} />
            </div>
            <div className="page-item">
              <BiSkipNext onClick={getLastPage} />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Seo;
