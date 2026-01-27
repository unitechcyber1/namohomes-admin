import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
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
import "./PriorityProjects.css";
import axios from "axios";
import { getMicrolocationByCity } from "../builder-projects/ProjectService";
import { getCity } from "../builders/BuilderService";
import Select from "react-select";
import {
  getProjectsDataByMicrolocation,
  getProjectsByMicrolocationWithPriority,
} from "./priorityProjectService";
import BASE_URL from "../../apiConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
function PriorityProjects() {
  const [loading, setLoading] = useState(false);
  const [projects, setprojects] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedprojects, setSearchedprojects] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [cities, setCities] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const toast = useToast();
  const [selectedMicroLocation, setSelectedMicroLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [priorityprojects, setPriorityprojects] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const handleFetchCity = async () => {
    await getCity(setCities);
  };
  const handleFetchMicrolocation = async (cityId) => {
    await getMicrolocationByCity(cityId, setMicrolocations);
  };
  const handleFetchProjectsData = async (id) => {
    setLoading(true);
    try {
      const projectsData = await getProjectsDataByMicrolocation(id);
      const priorityData = await getProjectsByMicrolocationWithPriority(id);
      const priorityProjectIds = new Set(priorityData.map(priorityProject => priorityProject._id));
      const updatedProjects = projectsData.map(project => ({
        ...project,
        isSelected: priorityProjectIds.has(project._id) 
      }));
      setprojects(updatedProjects);
      setPriorityprojects(priorityData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleFetchPriorityprojects = async (id) => {
    setLoadingTable(true);
    const data = await getProjectsByMicrolocationWithPriority(id);
    setPriorityprojects(data);
    setLoadingTable(false);
  };
  
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "city":
        setSelectedCity(selectedOption);

        handleFetchMicrolocation(selectedOption ? selectedOption.value : null);
        break;
      case "microLocation":
        setSelectedMicroLocation(selectedOption);
        handleFetchProjectsData(selectedOption ? selectedOption.value : "");
        break;
      default:
        break;
    }
  };
  const microLocationOptions = microlocations?.map((microLocation) => ({
    value: microLocation._id,
    label: microLocation.name,
  }));
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));

  const handleSearch = () => {
    const filteredprojects = projects.filter((workSpace) => {
      const matchName =
        workSpace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(workSpace.name.toLowerCase());
      return matchName;
    });

    setSearchedprojects(filteredprojects);
    setCurPage(1);
  };

  useEffect(() => {
    handleSearch();
    handleFetchCity();
    setShowAll(searchTerm === "");
  }, [updateTable, searchTerm]);

  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const nPage = Math.ceil(
    (showAll ? projects?.length : searchedprojects?.length) / selectItemNum
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
      (showAll ? projects?.length : searchedprojects?.length) / selectItemNum
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
    project.isSelected = !project.isSelected;
    try {
      const selectedMicroLocationId = selectedMicroLocation?.value;
      const activePriorityProjects = projects.filter((space) =>
        space.priority.some((p) => {
          if (
            p.microlocationId &&
            p.microlocationId === selectedMicroLocationId
          ) {
            return p.is_active === true;
          }
        })
      );
      const updatedProject = {
        is_active: checked,
        order: checked ? activePriorityProjects.length + 1 : 1000,
        microlocationId: selectedMicroLocationId,
      };
      await axios.put(
        `${BASE_URL}/api/admin/project/change-order/${project._id}`,
        updatedProject
      );
      project.priority.forEach((priority) => {
        return (priority.is_active = checked);
      });
      setprojects([...projects]);
      handleFetchPriorityprojects(selectedMicroLocationId);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const reorderedSpaces = Array.from(priorityprojects);
    const [movedSpace] = reorderedSpaces.splice(source.index, 1);
    reorderedSpaces.splice(destination.index, 0, movedSpace);

    const updatedOrderPayload = reorderedSpaces.map((space, index) => ({
      _id: space._id,
      priority: {
        order: index + 1,
        microlocationId: selectedMicroLocation?.value,
      },
    }));

    setPriorityprojects(reorderedSpaces);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/project/update-priority`,
        updatedOrderPayload
      );

      if (!response.ok) {
        throw new Error("Failed to update priority order.");
      }
    } catch (error) {
      console.error("Error updating priority order:", error);
    }
  };

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="table-box table_top_header">
        <div className="table-top-box">Priority Projects Module</div>
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
          <div className="col-md-3">
            <div className="drop_down_box">
              <Select
                placeholder="Microlocation*"
                value={selectedMicroLocation}
                options={microLocationOptions}
                onChange={(selectedOption) =>
                  onChangeOptionHandler(selectedOption, "microLocation")
                }
                isSearchable
                required
              />
            </div>
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
                  <Table variant="simple" className="table_border">
                    <Thead>
                      <Tr className="table_heading_row">
                        <Th>Select</Th>
                        <Th>Name</Th>

                        <Th>Location</Th>
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
                        (showAll ? projects : searchedprojects)
                          ?.slice(
                            (curPage - 1) * selectItemNum,
                            curPage * selectItemNum
                          )

                          .map((space) => (
                            <Tr key={space._id}>
                              <Td>
                                <input
                                  type="checkbox"
                                  checked={space.isSelected}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, space)
                                  }
                                />
                              </Td>
                              <Td>{space?.name}</Td>

                              <Td>
                                {space.location.micro_location?.map((micro) =>
                                  micro.name ===
                                  selectedMicroLocation?.label ? (
                                    <span key={micro._id}>{micro.name}</span>
                                  ) : null
                                )}
                              </Td>
                            </Tr>
                          ))
                      )}
                      {!loading &&
                        !(showAll ? projects : searchedprojects).slice(
                          (curPage - 1) * selectItemNum,
                          curPage * selectItemNum
                        ).length && (
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
                  value={selectItemNum}
                  onChange={itemsPerPageHandler}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} -{" "}
                {showAll
                  ? projects?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex
                  : searchedprojects?.slice(
                      (curPage - 1) * selectItemNum,
                      curPage * selectItemNum
                    ).length + firstIndex}{" "}
                of {showAll ? projects?.length : searchedprojects.length}
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
          <div className="table-top-box">Top Priority Projects Module</div>
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
                      <Droppable droppableId="projects">
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
                              priorityprojects?.map((space, index) => (
                                <Draggable
                                  key={space._id}
                                  draggableId={space._id}
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
                                        {space?.name}
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

export default PriorityProjects;
