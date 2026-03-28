import React, { useEffect, useState } from "react";
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
import { getCities } from "../../services/cityService";
import Select from "react-select";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getTopProjectsByCity,
  changeOrderOfProjects,
  changeOrderOfProjectsByDrag,
} from "../../services/newLaunchService";
import { getProjects } from "../../services/projectService";

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: 40,
    borderRadius: "0.75rem",
    borderColor: "rgb(226 232 240)",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": { borderColor: "rgb(203 213 225)" },
  }),
  menu: (base) => ({ ...base, borderRadius: "0.75rem", overflow: "hidden" }),
};

function NewLaunch() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [projects, setprojects] = useState([]);
  const [cities, setCities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCity, setSelectedCity] = useState(null);
  const [priorityprojects, setPriorityprojects] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState(null);
  const [query, setQuery] = useState({
    name: "",
    city: "",
    location: "",
    project_status: "",
    status: "approve",
    page: 1,
    limit: 10,
    project_type: "",
  });

  const handleFetchCity = async () => {
    const data = await getCities();
    setCities(data);
  };

  const getProjectDataWithPagination = async () => {
    setLoading(true);
    const data = await getProjects(query);
    setprojects(data?.projects);
    setTotalCount(data?.totalCount);
    setLoading(false);
  };

  const handleFetchTopProjects = async (cityId) => {
    setLoadingTable(true);
    const data = await getTopProjectsByCity(query, cityId);
    setPriorityprojects(data);
    setLoadingTable(false);
  };

  useEffect(() => {
    if (query.name || query.limit > 10 || query.page > 1) {
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
        query.city = selectedOption?.value;
        break;
      case "PlanType":
        setSelectedPlanType(selectedOption);
        query.project_status = selectedOption ? selectedOption.label : null;
        getProjectDataWithPagination();
        handleFetchTopProjects(selectedCity?.value);
        break;
      default:
        break;
    }
  };

  const projectStatus = [
    { value: "new", label: "New Launch" },
    { value: "rtm", label: "Ready To Move" },
    { value: "ucn", label: "Under Construction" },
  ];

  useEffect(() => {
    setprojects([]);
    setPriorityprojects([]);
    setSelectedCity({ value: "", label: "City*" });
    setQuery({
      name: "",
      city: "",
      location: "",
      project_status: "",
      status: "approve",
      page: 1,
      limit: 10,
    });
    handleFetchCity();
  }, []);

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
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / (query.limit || 10)));

  const prePage = () => {
    if (query.page > 1) {
      setQuery({ ...query, page: query.page - 1 });
    }
  };

  const nextPage = () => {
    if (query.page < totalPages) {
      setQuery({ ...query, page: query.page + 1 });
    }
  };

  const getFirstPage = () => {
    setQuery({ ...query, page: 1 });
  };

  const getLastPage = () => {
    setQuery({ ...query, page: totalPages });
  };

  const handleCheckboxChange = async (event, project) => {
    const { checked } = event.target;
    try {
      const updatedproject = {
        order: checked ? priorityprojects.length + 1 : 1000,
        status: checked,
        cityId: selectedCity?.value,
      };
      await changeOrderOfProjects(updatedproject, project._id);
      project.new_launch.status = checked;
      setprojects([...projects]);
      handleFetchTopProjects(selectedCity?.value);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update project. Please try again.",
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
      new_launch: {
        order: index + 1,
      },
    }));
    setPriorityprojects(reorderedprojects);
    try {
      await changeOrderOfProjectsByDrag(updatedOrderPayload);
    } catch (error) {
      toast({
        title: "Error Updating Order",
        description:
          error.message || "Failed to update priority order. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const citySelected =
    selectedCity?.value && String(selectedCity.value).length > 0;

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                New Launch
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Choose a city and plan type, then prioritize projects for the new
                launch list. Drag on the right to reorder.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-3xl">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  City
                </label>
                <Select
                  placeholder="City*"
                  value={selectedCity}
                  options={cityOptions}
                  styles={selectStyles}
                  onChange={(selectedOption) =>
                    onChangeOptionHandler(selectedOption, "city")
                  }
                  isSearchable
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Plan type
                </label>
                <Select
                  placeholder="Plan types*"
                  value={selectedPlanType}
                  options={projectStatus}
                  styles={selectStyles}
                  onChange={(selectedOption) =>
                    onChangeOptionHandler(selectedOption, "PlanType")
                  }
                  isSearchable
                  required
                />
              </div>
            </div>
          </div>

          <div className="newlaunch-split flex flex-col gap-6 lg:flex-row lg:gap-6 lg:items-start">
            {/* All projects */}
            <div className="newlaunch-split__left min-w-0 flex-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <h2 className="text-sm font-semibold text-slate-900">
                    All projects
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Toggle inclusion for the prioritized list. Search by name
                    below.
                  </p>
                </div>

                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <label className="sr-only" htmlFor="newlaunchSearch">
                    Search by name
                  </label>
                  <input
                    id="newlaunchSearch"
                    type="text"
                    className="h-10 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                    placeholder="Search by name…"
                    value={query.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="overflow-x-auto overscroll-x-contain">
                  <TableContainer className="newlaunch-split__table !mt-0">
                    <div className="data_table">
                      <Table variant="simple" className="min-w-[640px]">
                        <Thead className="bg-slate-50">
                          <Tr>
                            <Th w="14">Select</Th>
                            <Th>Name</Th>
                            <Th>City</Th>
                            <Th>Micro location</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading ? (
                            <Tr>
                              <Td colSpan={4} textAlign="center">
                                <div className="py-10">
                                  <Spinner />
                                  <div className="mt-3 text-sm text-slate-500">
                                    Loading projects…
                                  </div>
                                </div>
                              </Td>
                            </Tr>
                          ) : projects.length ? (
                            projects.map((project) => (
                              <Tr
                                key={project._id}
                                className="hover:bg-slate-50/60"
                              >
                                <Td>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500/40"
                                    checked={!!project?.new_launch?.status}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, project)
                                    }
                                  />
                                </Td>
                                <Td className="font-medium text-slate-900">
                                  <span className="line-clamp-2 max-w-[280px]">
                                    {project?.name}
                                  </span>
                                </Td>
                                <Td className="text-slate-700">
                                  {project.location?.city
                                    ? project.location?.city?.name
                                    : "—"}
                                </Td>
                                <Td className="text-slate-700">
                                  {project.location?.micro_location
                                    ? project.location?.micro_location[0]?.name
                                    : "—"}
                                </Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td colSpan={4} textAlign="center">
                                <div className="mx-auto max-w-md py-14">
                                  <div className="text-base font-semibold text-slate-900">
                                    No projects found
                                  </div>
                                  <div className="mt-1 text-sm text-slate-500">
                                    Adjust search or filters, or pick another
                                    city.
                                  </div>
                                </div>
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </div>
                  </TableContainer>
                </div>

                <div className="border-t border-slate-200 px-4 py-4 sm:px-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="text-xs font-medium text-slate-500">
                        Per page
                      </span>
                      <select
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none hover:border-slate-300 focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                        aria-label="Items per page"
                        name="limit"
                        value={query.limit}
                        onChange={handleInputChange}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span>
                        Showing{" "}
                        <span className="font-semibold text-slate-900">
                          {totalCount === 0
                            ? 0
                            : `${Math.min(firstIndex + 1, totalCount)}–${Math.min(
                                lastIndex,
                                totalCount
                              )}`}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">
                          {totalCount}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={query.page <= 1}
                        onClick={getFirstPage}
                      >
                        First
                      </button>
                      <button
                        type="button"
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={query.page <= 1}
                        onClick={prePage}
                      >
                        Previous
                      </button>
                      <span className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                        Page{" "}
                        <span className="font-semibold">{query.page}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                      </span>
                      <button
                        type="button"
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={query.page >= totalPages}
                        onClick={nextPage}
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={query.page >= totalPages}
                        onClick={getLastPage}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prioritized */}
            <div className="newlaunch-split__right min-w-0 flex-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Prioritized
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Drag rows to change order. List scrolls after many items.
                  </p>
                </div>

                <TableContainer
                  className="newlaunch-split__table newlaunch-priority-scroll !mt-0"
                  style={{ overflowX: "auto" }}
                >
                  <div className="data_table">
                    <Table variant="simple" className="min-w-[320px]">
                      <Thead className="bg-slate-50">
                        <Tr>
                          <Th w="20">Order</Th>
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
                              {!citySelected ? (
                                <Tr>
                                  <Td colSpan={2} textAlign="center">
                                    <div className="py-12 text-sm text-slate-500">
                                      Select a city to load the priority list.
                                    </div>
                                  </Td>
                                </Tr>
                              ) : loadingTable ? (
                                <Tr>
                                  <Td colSpan={2} textAlign="center">
                                    <div className="py-10">
                                      <Spinner />
                                      <div className="mt-3 text-sm text-slate-500">
                                        Loading priority list…
                                      </div>
                                    </div>
                                  </Td>
                                </Tr>
                              ) : priorityprojects.length ? (
                                priorityprojects.map((project, index) => (
                                  <Draggable
                                    key={project._id}
                                    draggableId={String(project._id)}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <Tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="hover:bg-slate-50/60"
                                      >
                                        <Td {...provided.dragHandleProps}>
                                          <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-lg bg-slate-100 text-sm font-medium text-slate-700">
                                            {index + 1}
                                          </span>
                                        </Td>
                                        <Td
                                          {...provided.dragHandleProps}
                                          className="font-medium text-slate-900"
                                        >
                                          {project?.name}
                                        </Td>
                                      </Tr>
                                    )}
                                  </Draggable>
                                ))
                              ) : (
                                <Tr>
                                  <Td colSpan={2} textAlign="center">
                                    <div className="mx-auto max-w-sm py-14">
                                      <div className="text-base font-semibold text-slate-900">
                                        No prioritized projects
                                      </div>
                                      <div className="mt-1 text-sm text-slate-500">
                                        Use the checkboxes on the left to add
                                        projects to this list.
                                      </div>
                                    </div>
                                  </Td>
                                </Tr>
                              )}
                              {provided.placeholder}
                            </Tbody>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </Table>
                  </div>
                </TableContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NewLaunch;
