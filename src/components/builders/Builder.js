import React, { useEffect, useMemo, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Link } from "react-router-dom";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";

import {
  Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Spinner, useToast
} from "@chakra-ui/react";

import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

import {
  getBuilders,
  deleteBuilderById
} from "services/builderService";

const Builder = () => {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  // ---------- Fetch ----------
  const fetchBuilders = async () => {
    try {
      setLoading(true);
      const data = await getBuilders();
      setBuilders(data);
    } catch (e) {
      toast({
        title: "Failed to load builders",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilders();
  }, []);

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    try {
      await deleteBuilderById(id);
      toast({ title: "Deleted", status: "success" });
      fetchBuilders();
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  // ---------- Derived Search ----------
  const filteredBuilders = useMemo(() => {
    if (!searchTerm) return builders;
    return builders.filter(b =>
      b.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [builders, searchTerm]);

  // ---------- Pagination ----------
  const totalPages = Math.ceil(filteredBuilders.length / perPage);
  const firstIndex = (curPage - 1) * perPage;
  const pageData = filteredBuilders.slice(
    firstIndex,
    firstIndex + perPage
  );
   const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
  };

  const prePage = () =>
    curPage > 1 && setCurPage(p => p - 1);

  const nextPage = () =>
    curPage < totalPages && setCurPage(p => p + 1);

  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Builder Module</h2>
      
      <Link to="/builder/add-builder" className="btnLink mt-2">
        <Addpropertybtn buttonText="ADD NEW" />
      </Link>
      </div>

       {/* Search */}
       <div className="row mt-2 project-card2">
        <div className="col-md-4 px-4">
          <input
            className="uniform-select-seo filter_row"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurPage(1);
            }}
          />
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

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4 pagination-bar">

          {/* LEFT SIDE */}
          <div className="page-info">
            Showing Page <strong>{curPage}</strong> out of <strong>{totalPages}</strong>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-2 pagination-controls">
            <button
              className="page-btn"
              disabled={curPage === 1}
              onClick={() => goToPage(curPage - 1)}
            >
              Previous
            </button>

            <span className="current-page">
              {curPage}
            </span>

            <button
              className="page-btn"
              disabled={curPage === totalPages}
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
