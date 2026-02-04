import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "services/projectService";
import { getCities } from "services/cityService";
import { getMicrolocations } from "services/microlocationService";

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
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMicroLocation, setSelectedMicroLocation] = useState(null);

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
      const data = await getProjects(query, url);
      setProjects(data?.projects || []);
      setTotalCount(data?.totalCount || 0);
    } finally {
      setLoading(false);
    }
  }, [query, url]);

const fetchInitialData = useCallback(async () => {
  try {
    setLoading(true);

    const [citiesData, microData] = await Promise.all([
      getCities(),
      getMicrolocations(),
    ]);

    setCities(citiesData);
    setMicrolocations(microData);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}, []);


  const handleDelete = async (id) => {
    try {
      await deleteProject(id, url);
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
      await changeProjectStatus(id, status, url);
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

  /* ------------------------------ PAGINATION ------------------------------- */

  const goToPage = (page) =>
    setQuery((q) => ({ ...q, page: Math.min(Math.max(page, 1), totalPages) }));

  /* ------------------------------- EFFECTS --------------------------------- */

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /* -------------------------------- RENDER -------------------------------- */

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <Link
        to={
          url.includes("dwarkaexpressway")
            ? "/dwarkaexpressway/builder-projects/add-builder-projects"
            : "/builder-projects/add-builder-projects"
        }
        className="btnLink mt-2"
      >
        <Addpropertybtn buttonText="ADD Project" />
      </Link>

      <div className="table-box space-table-box">
        <div className="table-top-box">Projects Module</div>

        {/* ------------------------------ FILTERS ----------------------------- */}
        <div className="row my-5 filter_row">
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Search by name"
              name="name"
              value={query.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
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
              className="form-select"
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
                    <Td>{project.status}</Td>
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
                          )}/${project?.location?.city?.name?.toLowerCase()}/$${
                            project.slug
                          }`}
                          target="_blank"
                        >
                          <AiOutlineEye />
                        </Link>
                      ) : (
                        <AiOutlineEye style={{ opacity: 0.4 }} />
                      )}
                    </Td>
                    <Td>
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

        {/* --------------------------- PAGINATION ----------------------------- */}
        <div className="d-flex align-items-center gap-3 mt-4">
          <select
            name="limit"
            value={query.limit}
            onChange={handleInputChange}
          >
            {[10, 25, 50, 100].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <span>
            {firstIndex + 1} - {firstIndex + projects.length} of {totalCount}
          </span>

          <BiSkipPrevious onClick={() => goToPage(1)} />
          <GrFormPrevious onClick={() => goToPage(query.page - 1)} />
          <GrFormNext onClick={() => goToPage(query.page + 1)} />
          <BiSkipNext onClick={() => goToPage(totalPages)} />
        </div>
      </div>
    </div>
  );
}

export default BuilderProjects;
