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
import { AiOutlineEye, AiFillEdit } from "react-icons/ai";
import Addpropertybtn from "../add-new-btn/Addpropertybtn";
import Delete from "../delete/Delete";
import Desable from "../delete/Desable";
import Approve from "../delete/Approve";
import {
  changeProjectStatus,
  deleteProject,
  getProjects,
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
/*                               MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

function BuilderProjects() {
  const toast = useToast();

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

  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" }); // UI-only sorting

  const selectStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: 40,
        height: 40,
        borderRadius: 10,
        borderColor: state.isFocused ? "#fda4af" : "#e2e8f0", // rose-300 / slate-200
        boxShadow: state.isFocused ? "0 0 0 4px rgba(244,63,94,0.15)" : "none", // rose-500/15
        "&:hover": { borderColor: "#cbd5e1" }, // slate-300
      }),
      valueContainer: (base) => ({
        ...base,
        height: 40,
        padding: "0 10px",
      }),
      input: (base) => ({ ...base, margin: 0, padding: 0 }),
      indicatorsContainer: (base) => ({ ...base, height: 40 }),
      placeholder: (base) => ({ ...base, color: "#94a3b8" }), // slate-400
      menuPortal: (base) => ({ ...base, zIndex: 60 }),
    }),
    []
  );

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

  const sortedProjects = useMemo(() => {
    const list = Array.isArray(projects) ? [...projects] : [];
    const dirMul = sort.dir === "asc" ? 1 : -1;

    const getValue = (p) => {
      switch (sort.key) {
        case "name":
          return (p?.name || "").toLowerCase();
        case "type":
          return (p?.project_type || "").toLowerCase();
        case "city":
          return (p?.location?.city?.name || "").toLowerCase();
        case "status":
          return (p?.status || "").toLowerCase();
        case "createdAt":
        default:
          return new Date(p?.createdAt || 0).getTime();
      }
    };

    list.sort((a, b) => {
      const av = getValue(a);
      const bv = getValue(b);
      if (av < bv) return -1 * dirMul;
      if (av > bv) return 1 * dirMul;
      return 0;
    });
    return list;
  }, [projects, sort.dir, sort.key]);

  /* ----------------------------- API HANDLERS ------------------------------ */

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const apiParams = {
        ...debouncedQuery,
        page: debouncedQuery.page,
        limit: debouncedQuery.limit,
      };
      const data = await getProjects(apiParams);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Builder Projects
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, and manage properties. Approve/reject and edit in one place.
          </p>
        </div>

        <Link to="/builder-projects/add-builder-projects" className="w-fit">
          <Addpropertybtn buttonText="ADD Project" />
        </Link>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[minmax(280px,420px)_1fr_auto] lg:items-center">
          {/* Left: Search */}
          <div className="relative w-full">
            <label className="sr-only" htmlFor="projectSearch">
              Search projects
            </label>
            <input
              id="projectSearch"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 pr-10 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
              placeholder="Search projects…"
              name="name"
              value={query.name}
              onChange={handleInputChange}
              aria-label="Search projects by name"
            />
            {query.name?.trim() && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-700"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Middle: Filters */}
          <div className="flex flex-wrap items-center gap-2.5 lg:flex-nowrap">
            <div className="w-full sm:w-[170px] lg:w-[160px]">
              <label className="sr-only" htmlFor="projectType">
                Project type
              </label>
              <select
                id="projectType"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                name="project_type"
                value={query.project_type}
                onChange={handleInputChange}
              >
                <option value="">Type: All</option>
                <option value="residential">Type: Residential</option>
                <option value="commercial">Type: Commercial</option>
              </select>
            </div>

            <div className="w-full sm:w-[190px] lg:w-[180px]">
              <Select
                classNamePrefix="rs"
                styles={selectStyles}
                menuPortalTarget={document.body}
                placeholder="City"
                value={selectedCity}
                options={cityOptions}
                onChange={(o) => handleSelectChange(o, "city")}
              />
            </div>

            <div className="w-full sm:w-[210px] lg:w-[200px]">
              <Select
                classNamePrefix="rs"
                styles={selectStyles}
                menuPortalTarget={document.body}
                placeholder="Location"
                value={selectedMicroLocation}
                options={microLocationOptions}
                onChange={(o) => handleSelectChange(o, "location")}
              />
            </div>

            <div className="w-full sm:w-[170px] lg:w-[160px]">
              <label className="sr-only" htmlFor="projectStatus">
                Status
              </label>
              <select
                id="projectStatus"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                name="status"
                value={query.status}
                onChange={handleInputChange}
              >
                <option value="">Status: All</option>
                <option value="pending">Status: Pending</option>
                <option value="approve">Status: Approved</option>
                <option value="reject">Status: Rejected</option>
              </select>
            </div>
          </div>

          {/* Right: Sort + Reset */}
          <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end">
            <div className="w-full sm:w-[190px] lg:w-[180px]">
              <label className="sr-only" htmlFor="projectSort">
                Sort
              </label>
              <select
                id="projectSort"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none hover:bg-white hover:border-slate-300 focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
                value={`${sort.key}:${sort.dir}`}
                onChange={(e) => {
                  const [key, dir] = String(e.target.value).split(":");
                  setSort({ key, dir });
                }}
                aria-label="Sort projects"
              >
                <option value="createdAt:desc">Sort: Newest</option>
                <option value="createdAt:asc">Sort: Oldest</option>
                <option value="name:asc">Sort: Name (A–Z)</option>
                <option value="name:desc">Sort: Name (Z–A)</option>
                <option value="status:asc">Sort: Status (A–Z)</option>
                <option value="status:desc">Sort: Status (Z–A)</option>
              </select>
            </div>

            <button
              type="button"
              className={[
                "h-10 rounded-xl border px-3 text-sm font-medium transition",
                hasActiveFilters(query)
                  ? "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400",
              ].join(" ")}
              onClick={handleReset}
              disabled={!hasActiveFilters(query)}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100/80 pt-3">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{totalCount}</span>{" "}
            total
            {hasActiveFilters(query) && (
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                Filters active
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Tip: use City + Location filters to narrow quickly
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto overscroll-x-contain">
          <TableContainer>
            <Table className="min-w-[980px]">
              <Thead className="bg-slate-50">
                <Tr>
                  <Th>NAME</Th>
                  <Th>TYPE</Th>
                  <Th>CITY</Th>
                  <Th>LOCATION</Th>
                  <Th>ADDED ON</Th>
                  <Th>STATUS</Th>
                  <Th textAlign="right">ACTIONS</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center">
                      <div className="py-10">
                        <Spinner />
                        <div className="mt-3 text-sm text-slate-500">
                          Loading projects…
                        </div>
                      </div>
                    </Td>
                  </Tr>
                ) : sortedProjects.length ? (
                  sortedProjects.map((project) => (
                    <Tr key={project._id} className="hover:bg-slate-50/60">
                      <Td>
                        <div className="max-w-[320px] truncate font-medium text-slate-900">
                          {project.name}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          ID: {project._id}
                        </div>
                      </Td>
                      <Td className="capitalize">{project.project_type}</Td>
                      <Td>{project.location?.city?.name || "-"}</Td>
                      <Td>{project.location?.micro_location?.[0]?.name || "-"}</Td>
                      <Td>
                        {project.createdAt
                          ? DATE_FORMATTER.format(new Date(project.createdAt))
                          : "-"}
                      </Td>
                      <Td>
                        <span className={`status-pill ${project.status}`}>
                          {project.status === "approve" && "Approved"}
                          {project.status === "reject" && "Rejected"}
                          {project.status === "pending" && "Pending"}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/builder-projects/edit-project/${project._id}`}
                            target="_blank"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                            aria-label="Edit project"
                            title="Edit"
                          >
                            <AiFillEdit />
                          </Link>

                          {project.status === "approve" ? (
                            <Link
                              to={`https://namohomesindia.com/property-details?id=${project._id}`}
                              target="_blank"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                              aria-label="View project"
                              title="View"
                            >
                              <AiOutlineEye />
                            </Link>
                          ) : (
                            <div
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400"
                              aria-label="Preview disabled until approved"
                              title="Preview available after approval"
                            >
                              <AiOutlineEye />
                            </div>
                          )}

                          <div className="flex items-center gap-1">
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
                        </div>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center">
                      <div className="mx-auto max-w-md py-14">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                          <span className="text-lg">⌕</span>
                        </div>
                        <div className="mt-4 text-base font-semibold text-slate-900">
                          No projects found
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Try adjusting your search or filters, or add a new project.
                        </div>
                        <div className="mt-5 flex justify-center gap-2">
                          <button
                            type="button"
                            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                            onClick={handleReset}
                          >
                            Clear filters
                          </button>
                          <Link to="/builder-projects/add-builder-projects">
                            <button
                              type="button"
                              className="h-9 rounded-xl bg-rose-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700"
                            >
                              Add project
                            </button>
                          </Link>
                        </div>
                      </div>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {totalCount > 0 ? firstIndex + 1 : 0}-
                {Math.min(firstIndex + projects.length, totalCount)}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{totalCount}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Per page</span>
              <select
                className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-500/20"
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

          <div className="flex items-center gap-2">
            <button
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={query.page <= 1 || totalPages === 0}
              onClick={() => goToPage(1)}
            >
              First
            </button>
            <button
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={query.page <= 1 || totalPages === 0}
              onClick={() => goToPage(query.page - 1)}
            >
              Previous
            </button>
            <span className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              Page <span className="font-semibold">{query.page}</span> of{" "}
              <span className="font-semibold">{totalPages || 1}</span>
            </span>
            <button
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={query.page >= totalPages || totalPages === 0}
              onClick={() => goToPage(query.page + 1)}
            >
              Next
            </button>
            <button
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={query.page >= totalPages || totalPages === 0}
              onClick={() => goToPage(totalPages || 1)}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuilderProjects;
