import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
} from "@chakra-ui/react";

import axios from "axios";
import BASE_URL from "../../apiConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getProjectData, searchedProjects  } from "../builder-projects/ProjectService";
import {getTopProjectsIndia} from "./PriorityService"
function Priority() {
  const [loading, setLoading] = useState(false);
  const [projects, setprojects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedprojects, setSearchedprojects] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [priorityprojects, setPriorityprojects] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [curPage, setCurPage] = useState(1);
  const [selectItemNum, setSelectItemNum] = useState(10);
  const [totalCount, setTotalCount] = useState(0)
  const [searchCount, setSearchCount] = useState(0)
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [microLocationSearchTerm, setMicroLocationSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("");
  const url = window.location.href
  const getProjectDataWithPagination = async() => {
    setIsLoading(true)
    const query = {page: curPage, limit: selectItemNum}
    const data = await getProjectData(query, url)
    setprojects(data?.projects)
    setTotalCount(data?.totalCount)
    setShowAll(false)
    setIsLoading(false)
  }

const getSearchProjects = async() => {
    setLoading(true)
    const data = await searchedProjects(searchTerm, citySearchTerm, microLocationSearchTerm, searchOption, curPage, selectItemNum)
    setSearchedprojects(data?.projects)
    setSearchCount(data?.totalCount)
    setLoading(false)
  }

  const getTopIndiaProjects = async() => {
    setLoadingTable(true)
    const data = await getTopProjectsIndia();
    setPriorityprojects(data)
    setLoadingTable(false)
  }
  useEffect(() => {
    if (searchTerm || citySearchTerm || microLocationSearchTerm || searchOption) {
      getSearchProjects();
      setShowAll(true)
    }
    else if(searchTerm === "" || citySearchTerm === "" || microLocationSearchTerm === "" ){
    getProjectDataWithPagination();
    setShowAll(false)
    }
    else{
      getProjectDataWithPagination();
      setShowAll(false)
    }
  }, [searchTerm, citySearchTerm, microLocationSearchTerm, searchOption]);
  useEffect(() => {
    getProjectDataWithPagination();
    getTopIndiaProjects();
  }, [curPage, selectItemNum]);

  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? searchCount : totalCount) / selectItemNum
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
      (showAll ? searchCount : totalCount) / selectItemNum
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

  const handleCheckboxChange = async (event, project) => {
    const { checked } = event.target;
    try {
      const updatedproject = {
        order: checked
          ? priorityprojects.length + 1
          : 1000,
        is_active: checked,
      };

      await axios.put(
        `${BASE_URL}/api/admin/project/priority-india/${project._id}`,
        updatedproject
      );
      project.priority_india.is_active = checked;
      getTopIndiaProjects()
      setprojects([...projects]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const reorderedprojects = Array.from(priorityprojects);
    const [movedproject] = reorderedprojects.splice(source.index, 1);
    reorderedprojects.splice(destination.index, 0, movedproject);

    const updatedOrderPayload = reorderedprojects.map((project, index) => ({
      _id: project._id,
      priority_india: {
        order: index + 1,
      },
    }));

    setPriorityprojects(reorderedprojects);
    try {
      await axios.put(
        `${BASE_URL}/api/admin/project/drag-priority`,
        updatedOrderPayload
      );
    } catch (error) {
      console.error("Error updating priority order:", error);
    }
  };
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="table_container">
        <div className="table-box top_table_box1">
          <div className="table-top-box">Projects Module</div>
          <TableContainer style={{ overflowX: "hidden" }}>
            <div className="row search_input">
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
            <div className="data_table">
              <div className="row">
                <div className="col-md-12">
                  <Table variant="simple">
                    <Thead>
                      <Tr className="table_heading_row">
                        <Th>SELECT</Th>
                        <Th>NAME</Th>
                        <Th>CITY</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {(showAll ? loading : isLoading) ? (
                        <Tr>
                          <Td colSpan={8} textAlign="center">
                            <Spinner size="lg" />
                          </Td>
                        </Tr>
                      ) : (
                        (showAll ? searchedprojects : projects).map(
                          (project) => (
                            <Tr className="table_data_row" key={project._id}>
                              <Td>
                                <input
                                  type="checkbox"
                                  checked={project.priority_india?.is_active}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, project)
                                  }
                                />
                              </Td>
                              <Td className="name_heading">{project.name}</Td>
                              <Td className="city_heading">
                                {project.location.city.name}
                              </Td>
                            </Tr>
                          )
                        )
                      )}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </div>
          </TableContainer>
          <nav className="mt-5">
            <div className="d-flex align-items-center justify-content-between">
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
                {firstIndex + 1} - {projects.length + firstIndex} of{" "}
                {showAll ? searchCount : totalCount}
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
        <div className="table-box top_table_box2">
          <div className="table-top-box">Top India Projects Module</div>
          <TableContainer style={{ overflowX: "hidden" }}>
            <div className="data_table">
              <div className="row">
                <div className="col-md-12">
                  <Table variant="simple" className="table_border">
                    <Thead>
                      <Tr>
                        <Th>Order</Th>
                        <Th>Name</Th>
                      </Tr>
                    </Thead>

                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="projectss">
                        {(provided) => (
                          <Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {loadingTable ? (
                              <Tr>
                                <Td colSpan={3} textAlign="center">
                                  <Spinner size="lg" />
                                </Td>
                              </Tr>
                            ) : (
                              priorityprojects.map((project, index) => (
                                <Draggable
                                  key={project._id}
                                  draggableId={project._id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <Tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                    >
                                      <Td {...provided.dragHandleProps}>
                                        {index + 1}
                                      </Td>
                                      <Td {...provided.dragHandleProps}>
                                        {project?.name}
                                      </Td>
                                    </Tr>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </Tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Table>
                </div>
              </div>
            </div>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Priority;
