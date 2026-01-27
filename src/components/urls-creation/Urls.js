import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
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
import "./Urls.css"
import { Link } from "react-router-dom";
import Delete from "../delete/Delete";
import { AiFillEdit } from "react-icons/ai";
import Desable from "../delete/Desable";
import Approve from "../delete/Approve";
import { changeUrlStatus, deleteUrls, getAllUrls } from "./urlService";
function Urls() {
  const [projects, setprojects] = useState([]);
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState({ slug: "", status: "", page: 1, limit: 10 })
  const toast = useToast()
  const url = window.location.href;
  const lastIndex = query.page * query.limit;
  const firstIndex = lastIndex - query.limit;
  const nPage = Math.ceil(
    totalCount / query.limit
  );
  const getProjectDataWithPagination = async () => {
    setLoading(true)
    const data = await getAllUrls(query);
    setprojects(data.data)
    setTotalCount(data?.totalCount)
    setLoading(false)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };
  const handleReset = () => {
    setQuery({ slug: "", status: "", page: 1, limit: 10 })
    getProjectDataWithPagination();
  }
  if (firstIndex > 0) {
    var prePage = () => {
      if (query.page !== firstIndex) {
        setQuery({ ...query, page: query.page - 1 });
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(
      totalCount / query.limit
    );
    if (query.page < lastPage) {
      setQuery({ ...query, page: query.page + 1 });
    }
  };
  const getFirstPage = () => {
    setQuery({ ...query, page: 1 });
  };
  const getLastPage = () => {
    setQuery({ ...query, page: nPage });
  };
  const handleDeleteprojects = async (id) => {
    try {
      await deleteUrls(id)
      getProjectDataWithPagination();
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

  const handleApprove = async (id) => {
    try {
      await changeUrlStatus(id, "approve", url);
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      getProjectDataWithPagination()
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
  const handleReject = async (id) => {
    try {
      await changeUrlStatus(id, "reject", url);
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      getProjectDataWithPagination()
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
  useEffect(() => {
    if (query.status) {
      const debounceTimer = setTimeout(() => {
        getProjectDataWithPagination();
      }, 1000)
      return () => clearTimeout(debounceTimer);
    }
    if (query.slug) {
      const debounceTimer = setTimeout(() => {
        getProjectDataWithPagination();
      }, 1000)
      return () => clearTimeout(debounceTimer);
    }
    if (query.slug === "") {
      query.slug = ""
      getProjectDataWithPagination();
    }
    if (query.limit) {
      getProjectDataWithPagination();
    }
    if (query.page) {
      getProjectDataWithPagination();
    }
  }, [query.status, query.slug, query.limit, query.page]);
  useEffect(() => {
    getProjectDataWithPagination();
  }, [query.page, query.limit, url]);
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <Link to={url.includes("dwarkaexpressway") ? "/dwarkaexpressway/create-url" : "/builder-projects/add-builder-projects"} className="btnLink mt-2">
        <Addpropertybtn buttonText={"ADD URL"} />
      </Link>
      <div className="table-box space-table-box">
        <div className="table-top-box">All Url Module</div>
        <TableContainer overflowX="hidden">
          <div className="row my-5 filter_row">
            <div className="col-md-2">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Search by Slug"
                  name="slug"
                  value={query.slug}
                  onChange={handleInputChange}
                />
                <label htmlFor="floatingInput">Search By Slug</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-floating">
                <select
                  className="form-select type_select"
                  id="floatingSelectGrid"
                  aria-label="Floating label select example"
                  name="status"
                  value={query.status}
                  onChange={handleInputChange}
                >
                  <option value="all">All</option>
                  <option value="pending">pending</option>
                  <option value="reject">reject</option>
                  <option value="approve">approve</option>
                </select>
                <label htmlFor="floatingSelectGrid">Status</label>
              </div>
            </div>
            <div className="col-md-2">
              <button className="reset_button" onClick={handleReset}>Reset</button>
            </div>
          </div>
          <div className="data_table">
            <div className="row">
              <div className="col-md-12">
                <Table variant="simple">
                  <Thead>
                    <Tr className="table_heading_row">
                      <Th className="name_heading">NAME</Th>
                      <Th className="time_heading">ADDED ON</Th>
                      <Th className="status_heading">STATUS</Th>
                      <Th className="edit_heading">EDIT</Th>
                      <Th className="preview_heading">PREVIEW</Th>
                      <Th className="action_heading">ACTION</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loading ? (
                      <Tr>
                        <Td colSpan={8} textAlign="center">
                          <Spinner size="lg" />
                        </Td>
                      </Tr>
                    ) : (
                      projects
                        .map((project, index) => (
                          <Tr className="table_data_row" key={project._id}>
                            <Td className="name_heading">{project.slug}</Td>
                            <Td className="time_heading">
                              {new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(new Date(project.createdAt))}
                            </Td>
                            <Td className="status_heading" textAlign="center">
                              {project.status === "approve"
                                ? "AP"
                                : project.status === "reject"
                                  ? "RJ"
                                  : project.status === "pending"
                                    ? "PD"
                                    : ""}
                            </Td>
                            <Td className="edit_heading">
                              <Link
                                to={url.includes('dwarkaexpressway') && `/dwarkaexpressway/edit-url/${project._id}`}
                                target="_blank"
                              >
                                <AiFillEdit
                                  style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "20px",
                                  }}
                                />
                              </Link>
                            </Td>
                            <Td className="preview_heading">
                              {(project?.status == "approve") ? (
                                <Link
                                  to={`https://www.dwarkaexpresswayprojects.in/${project.slug}`}
                                  target="_blank"
                                >
                                  <AiOutlineEye
                                    style={{
                                      margin: "auto",
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Link>
                              ) : (
                                <AiOutlineEye
                                  style={{
                                    margin: "auto",
                                    fontSize: "20px",
                                    cursor: "not-allowed",
                                    opacity: 0.5, // Optionally reduce opacity to indicate disabled state
                                  }}
                                />
                              )}
                            </Td>
                            <Td className="action_heading">
                              <div
                                className="d-flex justify-content-between align-items-center main-div w-100"
                              >
                                <Approve id={index} isEnabled={project.status === "reject" || project.status === "pending"} handleFunction={() => handleApprove(project._id)} />
                                <Desable id={index} isEnabled={project.status === "approve" || project.status === "pending"} handleFunction={() => handleReject(project._id)} />
                                <Delete id={index} handleFunction={() => handleDeleteprojects(project._id)} />
                              </div>
                            </Td>
                          </Tr>
                        ))
                    )}
                    {(!loading && projects.length == 0) && (
                      <Tr>
                        <Td colSpan={8}>No matching results found.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </div>
            </div>
          </div>
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
                name="limit"
                value={query.limit}
                onChange={handleInputChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div style={{ width: "110px" }}>
              {firstIndex + 1} -{" "}
              {projects.length + firstIndex}
              {" "}
              of {totalCount}
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

export default Urls;