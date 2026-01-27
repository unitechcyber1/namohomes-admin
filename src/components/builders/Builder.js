import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Link } from "react-router-dom";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
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
import { deleteBuildersById, getbuildersData } from "./BuilderService";
const Builder = () => {
  const [loading, setLoading] = useState(false);
  const [builders, setbuilders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedbuilders, setSearchedbuilders] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const toast = useToast();

  const handleFetchBuilders = async () => {
  setLoading(true)
  const data = await getbuildersData();
  setbuilders(data)
  setLoading(false)
  };
  useEffect(() => {
    handleFetchBuilders();
  }, []);

  const handleDeletebuilders = async (id) => {
    try {
      await deleteBuildersById(id)
      handleFetchBuilders();
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = () => {
    const filteredbuilders = builders.filter((builder) => {
      const matchName =
        builder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(builder.name.toLowerCase());

      return matchName;
    });

    setSearchedbuilders(filteredbuilders);
    setCurPage(1);
  };
  useEffect(() => {
    handleSearch();
    setShowAll(searchTerm === "");
  }, [searchTerm]);

  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? builders.length : searchedbuilders.length) / selectItemNum
  );
  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(
      (showAll ? builders.length : searchedbuilders.length) / selectItemNum
    );
    if (curPage < lastPage) {
      setCurPage((prev) => prev + 1);
    }
  };
  const getFirstPage = () => {
    setCurPage(1);
  };

  const getLastPage = () => {
    setCurPage(nPage);
  };

  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
        <Link to="/builder/add-builder" className="btnLink mt-2">
          <Addpropertybtn buttonText={"ADD NEW"} />
        </Link>
        <div className="table-box space-table-box">
          <div className="table-top-box">Builder Module</div>
          <TableContainer
            marginTop="60px"
            variant="striped"
            color="teal"
            overflowX="hidden"
          >
            <div className="row">
              <div className="col-md-3">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Search by name</label>
                </div>
              </div>
            </div>
            <Table variant="simple" marginTop="20px">
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
                    <Td>
                      <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        style={{ position: "absolute", left: "482px" }}
                      />
                    </Td>
                  </Tr>
                ) : showAll ? (
                  builders
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((builder) => (
                      <Tr key={builder._id} id={builder._id}>
                        <Td>{builder.name.toUpperCase()}</Td>
                        <Td className="tableDescription">
                          {(builder?.seo?.description?.length > 50
                            ? builder?.seo?.description.substring(0, 50) + "..."
                            : builder?.seo?.description) || "Empty"}
                        </Td>

                        <Td>
                          <Link to={`/builder/edit-builder/${builder._id}`}>
                            <AiFillEdit
                              style={{ fontSize: "22px", cursor: "pointer" }}
                            />
                          </Link>
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeletebuilders(builder._id)
                            }
                          />
                        </Td>
                      </Tr>
                    ))
                ) : searchedbuilders.length > 0 ? (
                  searchedbuilders
                    .slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    )
                    .map((builder) => (
                      <Tr key={builder._id} id={builder._id}>
                        <Td>{builder.name.toUpperCase()}</Td>
                        <Td className="tableDescription">
                          {(builder?.seo?.description?.length > 50
                            ? builder?.seo?.description.substring(0, 50) + "..."
                            : builder?.seo?.description) || "Empty"}
                        </Td>

                        <Td>
                          <Link to={`/builder/edit-builder/${builder._id}`}>
                            <AiFillEdit
                              style={{ fontSize: "22px", cursor: "pointer" }}
                            />
                          </Link>
                        </Td>
                        <Td>
                          <Delete
                            handleFunction={() =>
                              handleDeletebuilders(builder._id)
                            }
                          />
                        </Td>
                      </Tr>
                    ))
                ) : (
                  <Tr>
                    <Td colSpan={8}>No matching results found.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <nav className="mt-5">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "51%" }}
            >
              <p className="mb-0">Items per page: </p>
              <div style={{ borderBottom: "1px solid gray" }}>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={selectItemNum}
                  onChange={itemsPerPageHandler}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? builders.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedbuilders?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of {showAll ? builders?.length : searchedbuilders.length}
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
    </>
  );
};

export default Builder;
