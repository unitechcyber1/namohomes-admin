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
  useToast,
} from "@chakra-ui/react";
import "./TopProjects.css";
import axios from "axios";
import { getCity } from "../builders/BuilderService";
import Select from "react-select";
import BASE_URL from "../../apiConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getTopProjectsByCity,
  getProjectsDataByCity,
  changeOrderOfProjects,
  changeOrderOfProjectsByDrag,
} from "./TopProjectService";
import { getProjectData } from "../builder-projects/ProjectService";
function Popularproject() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [projects, setprojects] = useState([]);
  const [cities, setCities] = useState([]);
  const [totalCount, setTotalCount] = useState(0)
  const [selectedCity, setSelectedCity] = useState(null);
  const [priorityprojects, setPriorityprojects] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState({ name: "", city: "", location: "", status: "approve", page: 1, limit: 10, project_type: "" })
  const url = window.location.href;
  const handleFetchCity = async () => {
    await getCity(setCities);
  };
  const getProjectDataWithPagination = async () => {
    setLoading(true)
    const data = await getProjectData(query, url)
    setprojects(data?.projects)
    setTotalCount(data?.totalCount)
    setLoading(false)
  }
  const handleFetchTopProjects = async (cityId) => {
    setLoadingTable(true)
    const data = await getTopProjectsByCity(cityId, url)
    setPriorityprojects(data)
    setLoadingTable(false)
  };
  useEffect(() => {
   if(query.name || query.limit > 10 || query.page > 1) {
    setMounted(true);
   }
  }, [query.name, query.limit, query.page]);
  useEffect(() => {
    if (mounted && (query.name || query.limit > 10 || query.page > 1)) {
      setLoading(true);
      const debounceTimer = setTimeout(() => {
        getProjectDataWithPagination();
      }, 1000);
      return () => clearTimeout(debounceTimer);
    }
    if (mounted && query.name === "") {
      getProjectDataWithPagination();
    }
  }, [mounted, query.name, query.limit, query.page]);
  
  
  
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "city":
        setSelectedCity(selectedOption);
        query.city = selectedOption.value
        getProjectDataWithPagination()
        handleFetchTopProjects(selectedOption ? selectedOption.value : null);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
   setprojects([])
   setPriorityprojects([])
   setSelectedCity({value: "", label: "City*"})
   setQuery({ name: "", city: "", location: "", status: "approve", page: 1, limit: 10 })
   handleFetchCity();
  }, [url]);
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };
  const lastIndex = query.page * query.limit;
  const firstIndex = lastIndex - query.limit;
  const nPage = Math.ceil(
    totalCount / query.limit
  );
  if (firstIndex > 0) {
    var prePage = () => {
      if (query.page !== firstIndex) {
        setQuery({...query, page: query.page-1});
      }
    };
  }

  var nextPage = () => {
    const lastPage = Math.ceil(
      totalCount / query.limit
    );
    if (query.page < lastPage) {
      setQuery({...query, page: query.page+1});
    }
  };
  const getFirstPage = () => {
    setQuery({...query, page: 1});
  };
  const getLastPage = () => {
    setQuery({...query, page: nPage});
  };  
  const handleCheckboxChange = async (event, project) => {
    const { checked } = event.target;
    try {
      const updatedproject = {
        order: checked
          ? priorityprojects.length + 1
          : 1000,
        status: checked,
        cityId: selectedCity?.value,
      };
      await changeOrderOfProjects(updatedproject, project._id, url)
      project.is_popular.status = checked;
      setprojects([...projects]);
      handleFetchTopProjects(selectedCity?.value);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      is_popular: {
        order: index + 1,
      },
    }));
    setPriorityprojects(reorderedprojects);
    try {
     await changeOrderOfProjectsByDrag(updatedOrderPayload, url)
    } catch (error) {
      toast({
        title: "Error Updating Order",
        description: error.message || "Failed to update priority order. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="table-box table_top_header">
        <div className="table-top-box">Popular Projects Module</div>
        <div className="row my-5">
          <div className="col-md-3">
            <Select
              placeholder="City*"
              value={selectedCity}
              options={cityOptions}
              onChange={(selectedOption) =>
                onChangeOptionHandler(selectedOption, "city")
              }
              isSearchable
              required
            />
          </div>
        </div>
      </div>
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
                    value={query.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="floatingInput">Search by name</label>
                </div>
              </div>
            </div>
            <div className="data_table">
              <div className="row">
                <div className="col-md-12">
                  <Table variant="simple" className="table_border">
                    <Thead>
                      <Tr className="table_heading_row">
                        <Th>Select</Th>
                        <Th>Name</Th>
                        <Th>City</Th>
                        <Th>MicroLocation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loading ? (
                        <Tr>
                          <Td colSpan={8} textAlign="center">
                            <Spinner size="lg" />
                          </Td>
                        </Tr>
                      ) :  projects.map((project) => (
                            <Tr key={project._id}>
                              <Td>
                                <input
                                  type="checkbox"
                                  checked={project.is_popular.status}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, project)
                                  }
                                />
                              </Td>
                              <Td>
                                {project?.name.length > 20
                                  ? project?.name.slice(0, 15) + "..."
                                  : project?.name}
                              </Td>
                              <Td className="city_heading">
                                {project.location?.city
                                  ? project.location?.city?.name
                                  : ""}
                              </Td>
                              <Td>
                                {project.location?.micro_location
                                  ? project.location?.micro_location[0]?.name
                                  : ""}
                              </Td>
                            </Tr>
                          ))
                      
                      }
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
            style={{ width: "70%" }}
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
        <div className="table-box top_table_box2">
          <div className="table-top-box">Popular projects Module</div>
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

export default Popularproject;
