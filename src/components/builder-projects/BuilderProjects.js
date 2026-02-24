import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./BuilderProject.css";
import { Link } from "react-router-dom";
import Select from "react-select";
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
import {
  GrFormPrevious,
  GrFormNext,
} from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { AiOutlineEye, AiFillEdit } from "react-icons/ai";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import Delete from "../delete/Delete";
import Desable from "../delete/Desable";
import Approve from "../delete/Approve";
import {
  changeProjectStatus,
  deleteProject,
  getProjects,
  searchProjects,
} from "../../services/projectService";
import { getCities } from "../../services/cityService";
import { getMicrolocations } from "../../services/microlocationService";

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

const INITIAL_QUERY = {
  name: "",
  city: "",
  location: "",
  status: "",
  page: 1,
  limit: 10,
  project_type: "",
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SEARCH_DEBOUNCE_MS = 400;

const hasActiveFilters = (q) =>
  Boolean(
    (q.name && q.name.trim()) ||
      q.city ||
      q.location ||
      q.status ||
      q.project_type
  );

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                               */
/* -------------------------------------------------------------------------- */

const generateSlug = (value) =>
  value ? value.replace(/\s+/g, "-").toLowerCase() : "";

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

function BuilderProjects() {
  const toast = useToast();
  const url = window.location.href;

  /* ------------------------------- STATE ---------------------------------- */
  const [projects, setProjects] = useState([]);
  const [cities, setCities] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState(INITIAL_QUERY);
  const [debouncedQuery, setDebouncedQuery] = useState(INITIAL_QUERY);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMicroLocation, setSelectedMicroLocation] = useState(null);
  const debounceTimerRef = useRef(null);

  /* ----------------------------- DERIVED DATA ------------------------------ */
  const firstIndex = useMemo(
    () => (query.page - 1) * query.limit,
    [query.page, query.limit]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalCount / query.limit),
    [totalCount, query.limit]
  );

  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c._id, label: c.name })),
    [cities]
  );

  const microLocationOptions = useMemo(
    () => microlocations.map((m) => ({ value: m._id, label: m.name })),
    [microlocations]
  );

  /* ----------------------------- API HANDLERS ------------------------------ */

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const apiParams = {
        ...debouncedQuery,
        page: debouncedQuery.page,
        limit: debouncedQuery.limit,
      };
      const data = hasActiveFilters(debouncedQuery)
        ? await searchProjects(apiParams)
        : await getProjects(apiParams);
      setProjects(data?.projects || []);
      setTotalCount(data?.totalCount ?? 0);
    } catch (err) {
      toast({
        title: "Failed to load projects",
        description: err?.response?.data?.message || "Please try again later.",
        status: "error",
        isClosable: true,
      });
      setProjects([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, toast]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [citiesData, microData] = await Promise.all([
        getCities(),
        getMicrolocations(),
      ]);
      setCities(Array.isArray(citiesData) ? citiesData : citiesData?.cities ?? citiesData?.data ?? []);
      setMicrolocations(Array.isArray(microData) ? microData : microData?.locations ?? microData?.data ?? []);
    } catch (error) {
      toast({
        title: "Failed to load filters",
        description: "City and location filters may be unavailable.",
        status: "warning",
        isClosable: true,
      });
    }
  }, [toast]);


  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      toast({ title: "Deleted Successfully", status: "success" });
      fetchProjects();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await changeProjectStatus(id, status);
      toast({ title: "Updated Successfully", status: "success" });
      fetchProjects();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
        status: "error",
      });
    }
  };

  /* ----------------------------- EVENT HANDLERS ---------------------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSelectChange = (option, type) => {
    if (type === "city") {
      setSelectedCity(option);
      setQuery((q) => ({ ...q, city: option?.value || "", page: 1 }));
    }
    if (type === "location") {
      setSelectedMicroLocation(option);
      setQuery((q) => ({ ...q, location: option?.value || "", page: 1 }));
    }
  };

  const handleReset = () => {
    setQuery(INITIAL_QUERY);
    setSelectedCity(null);
    setSelectedMicroLocation(null);
  };

  const clearSearch = () => {
    setQuery((q) => ({ ...q, name: "", page: 1 }));
  };

  /* ------------------------------ PAGINATION ------------------------------- */

  const goToPage = (page) =>
    setQuery((q) => ({
      ...q,
      page: Math.min(Math.max(page, 1), totalPages || 1),
    }));

  const handlePageSizeChange = (e) => {
    const limit = Number(e.target.value) || 10;
    setQuery((q) => ({ ...q, limit, page: 1 }));
  };

  /* ------------------------------- EFFECTS --------------------------------- */

  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /* -------------------------------- RENDER -------------------------------- */

  return (
    <div className="mx-5 mt-4">
      <Mainpanelnav />
      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">Projects Module</h2>
        <Link
          to={
            url.includes("dwarkaexpressway")
              ? "/dwarkaexpressway/builder-projects/add-builder-projects"
              : "/builder-projects/add-builder-projects"
          }
          className="btnLink mt-2">
          <Addpropertybtn buttonText="ADD Project" />
        </Link>
      </div>
      {/* ------------------------------ FILTERS ----------------------------- */}
      <div className="  project-card2 mt-4 row  filter_row">
        <div className="col-md-2 position-relative">
          <input
            className="uniform-select2"
            placeholder="Search by name"
            name="name"
            value={query.name}
            onChange={handleInputChange}
            aria-label="Search projects by name"
          />
          {query.name?.trim() && (
            <button
              type="button"
              onClick={clearSearch}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="col-md-2">
          <select
            className="uniform-select2"
            name="project_type"
            value={query.project_type}
            onChange={handleInputChange}
          >
            <option value="">All</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="col-md-2">
          <Select
            placeholder="City"
            value={selectedCity}
            options={cityOptions}
            onChange={(o) => handleSelectChange(o, "city")}
          />
        </div>

        <div className="col-md-2">
          <Select
            placeholder="Location"
            value={selectedMicroLocation}
            options={microLocationOptions}
            onChange={(o) => handleSelectChange(o, "location")}
          />
        </div>

        <div className="col-md-2">
          <select
            className="uniform-select2"
            name="status"
            value={query.status}
            onChange={handleInputChange}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approve">Approved</option>
            <option value="reject">Rejected</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="reset_button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="table-box pb-3">
        {/* ------------------------------ TABLE ------------------------------- */}
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>NAME</Th>
                <Th>TYPE</Th>
                <Th>CITY</Th>
                <Th>LOCATION</Th>
                <Th>ADDED ON</Th>
                <Th>STATUS</Th>
                <Th>EDIT</Th>
                <Th>PREVIEW</Th>
                <Th>ACTION</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    <Spinner />
                  </Td>
                </Tr>
              ) : projects.length ? (
                projects.map((project) => (
                  <Tr key={project._id}>
                    <Td>{project.name}</Td>
                    <Td>{project.project_type}</Td>
                    <Td>{project.location?.city?.name}</Td>
                    <Td>{project.location?.micro_location?.[0]?.name}</Td>
                    <Td>{DATE_FORMATTER.format(new Date(project.createdAt))}</Td>
                    <Td>
                      <button
                        type="button"
                        className={`status-pill ${project.status}`}
                      >
                        {project.status === "approve" && "Approved"}
                        {project.status === "reject" && "Rejected"}
                        {project.status === "pending" && "Pending"}
                        <span className="arrow">›</span>
                      </button>
                    </Td>


                    <Td>
                      <Link
                        to={`/builder-projects/edit-project/${project._id}`}
                        target="_blank"
                      >
                        <AiFillEdit />
                      </Link>
                    </Td>
                    <Td>
                      {project.status === "approve" ? (
                        <Link
                          to={`https://propularity.in/${generateSlug(
                            project?.builder?.name
                          )}/${project?.location?.city?.name?.toLowerCase()}/${project?.slug || ""}`}
                          target="_blank"
                        >
                          <AiOutlineEye />
                        </Link>
                      ) : (
                        <AiOutlineEye style={{ opacity: 0.4 }} />
                      )}
                    </Td>
                    <Td>
                       <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <Approve
                        isEnabled={project.status !== "approve"}
                        handleFunction={() =>
                          handleStatusChange(project._id, "approve")
                        }
                      />
                      <Desable
                        isEnabled={project.status !== "reject"}
                        handleFunction={() =>
                          handleStatusChange(project._id, "reject")
                        }
                      />
                      <Delete
                        handleFunction={() => handleDelete(project._id)}
                      />
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    No results found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <div className="d-flex justify-content-between align-items-center mt-4 pagination-bar flex-wrap gap-2">
          {/* LEFT SIDE */}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="page-info">
              Showing{" "}
              <strong>
                {totalCount > 0 ? firstIndex + 1 : 0}-
                {Math.min(firstIndex + projects.length, totalCount)}
              </strong>{" "}
              of <strong>{totalCount}</strong> projects
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 small">Per page:</label>
              <select
                className="uniform-select2"
                style={{ width: "auto", minWidth: "70px" }}
                value={query.limit}
                onChange={handlePageSizeChange}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-2 pagination-controls">
            <button
              className="page-btn"
              disabled={query.page <= 1 || totalPages === 0}
              onClick={() => goToPage(query.page - 1)}
            >
              Previous
            </button>

            <span className="current-page">
              Page {query.page} of {totalPages || 1}
            </span>

            <button
              className="page-btn"
              disabled={query.page >= totalPages || totalPages === 0}
              onClick={() => goToPage(query.page + 1)}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BuilderProjects;
