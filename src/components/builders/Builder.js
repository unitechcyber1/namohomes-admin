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

  const prePage = () =>
    curPage > 1 && setCurPage(p => p - 1);

  const nextPage = () =>
    curPage < totalPages && setCurPage(p => p + 1);

  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <Link to="/builder/add-builder" className="btnLink mt-2">
        <Addpropertybtn buttonText="ADD NEW" />
      </Link>

      <div className="table-box space-table-box">
        <div className="table-top-box">Builder Module</div>

        <TableContainer mt="60px" overflowX="hidden">

          {/* Search */}
          <input
            className="form-control mb-3"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurPage(1);
            }}
          />

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
        <div className="mt-4 d-flex gap-3 align-items-center">

          <select
            value={perPage}
            onChange={e => {
              setPerPage(Number(e.target.value));
              setCurPage(1);
            }}
          >
            {[10,25,50,100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <BiSkipPrevious onClick={() => setCurPage(1)} />
          <GrFormPrevious onClick={prePage} />
          <GrFormNext onClick={nextPage} />
          <BiSkipNext onClick={() => setCurPage(totalPages)} />

          <span>
            {firstIndex + 1}–
            {Math.min(firstIndex + perPage, filteredBuilders.length)}
            of {filteredBuilders.length}
          </span>

        </div>
      </div>
    </div>
  );
};

export default Builder;
