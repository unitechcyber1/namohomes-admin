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
import { useToast } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getProjectData } from "../builder-projects/ProjectService";
import { useParams } from "react-router-dom";
import { getUrlById, saveUrls, updatedUrls } from "./urlService";
function AddUrls() {
    const [projects, setprojects] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [isEditable, setIsEditable] = useState(false)
    const [urlById, setUrlById] = useState({})
    const [query, setQuery] = useState({ name: "", city: "", location: "", status: "approve", page: 1, limit: 10, project_type: "" })
    const [urls, setUrls] = useState({
        slug: "", DwarkaProjects: [{
            projects: "",
            order: 0
        }],
        city: "650028ee87a793abe11b8a98"
    })
    const toast = useToast();
    const url = window.location.href
    const { id } = useParams()
    const getProjectDataWithPagination = async () => {
        setIsLoading(true)
        const data = await getProjectData(query, url)
        setprojects(data?.projects)
        setTotalCount(data?.totalCount)
        setIsLoading(false)
    }
    const fetchUrlById = async () => {
        setLoadingTable(true)
        const data = await getUrlById(id);
        setUrlById(data)
        setIsEditable(true)
        setLoadingTable(false)
    }
    useEffect(() => {
        if (id) {
            fetchUrlById();
        } else {
            setUrlById({});
            setIsEditable(false);
        }
    }, [id]);
    useEffect(() => {
        if (urlById && isEditable) {
            setUrls({ ...urlById })
        }
        else {
            setUrls({
                slug: "", DwarkaProjects: [],
                city: "650028ee87a793abe11b8a98"
            });
        }
    }, [urlById]);
    useEffect(() => {
        getProjectDataWithPagination();
    }, [query.page, query.limit]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuery({
            ...query,
            [name]: value,
        });
    };
    const handleInput = (e) => {
        const { name, value } = e.target;
        setUrls({
            ...urls,
            [name]: value,
        });
    };
    useEffect(() => {
        if (query.name) {
            const debounceTimer = setTimeout(() => {
                getProjectDataWithPagination();
            }, 1000)
            return () => clearTimeout(debounceTimer);
        }
        if (query.name === "") {
            query.name = ""
            getProjectDataWithPagination();
        }
        if (query.limit) {
            getProjectDataWithPagination();
        }
        if (query.page) {
            getProjectDataWithPagination();
        }
    }, [query.name, query.limit, query.page]);
    const lastIndex = query.page * query.limit;
    const firstIndex = lastIndex - query.limit;
    const nPage = Math.ceil(
        totalCount / query.limit
    );
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
    const handleCheckboxChange = async (event, project) => {
        const { checked } = event.target;
        try {
            if (checked) {
                setUrls((prevUrls) => ({
                    ...prevUrls,
                    DwarkaProjects: [
                        ...prevUrls.DwarkaProjects,
                        { projects: project, order: prevUrls.DwarkaProjects.length }
                    ]
                }));
            } else {
                setUrls((prevUrls) => ({
                    ...prevUrls,
                    DwarkaProjects: prevUrls.DwarkaProjects.filter(
                        (item) => item.projects._id !== project._id
                    )
                }));
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    const _setProjectIdForServer = () => {
        let DwarkaProjects = [];
        urls.DwarkaProjects.forEach(item => {
            if (!item.projects) {
                return
            }
            let obj = { order: item.order, projects: item.projects._id }
            DwarkaProjects.push(obj)
        });
        return DwarkaProjects;
    };
    const handleSaveAndUpdate = async (e) => {
        e.preventDefault();
        urls.DwarkaProjects = _setProjectIdForServer()
        try {
            if (isEditable) {
                if (url.includes('dwarkaexpressway')) {
                    await updatedUrls(id, urls)
                }
            } else {
                if (url.includes('dwarkaexpressway')) {
                    await saveUrls(urls)
                }
            }
            toast({
                title: isEditable ? "Update Successfully!" : "Saved Successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Saved the Space",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    const onDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) return;
        const reorderedProjects = Array.from(urls.DwarkaProjects);
        const [movedProject] = reorderedProjects.splice(source.index, 1);
        reorderedProjects.splice(destination.index, 0, movedProject);
        const updatedOrderPayload = reorderedProjects.map((project, index) => ({
            ...project,
            order: index + 1,
        }));
        try {
            setUrls((prevUrls) => ({
                ...prevUrls,
                DwarkaProjects: [...updatedOrderPayload]
            }));
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    return (
        <div className="mx-5 mt-3">
            <Mainpanelnav />
            <div className="table_container">
                <div className="table-box top_table_box1">
                    <div className="table-top-box">All Projects</div>
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
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr className="table_heading_row">
                                                <Th>SELECT</Th>
                                                <Th>NAME</Th>
                                                <Th>CITY</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {isLoading ? (
                                                <Tr>
                                                    <Td colSpan={8} textAlign="center">
                                                        <Spinner size="lg" />
                                                    </Td>
                                                </Tr>
                                            ) : (
                                                projects.map(
                                                    (project) => (
                                                        <Tr className="table_data_row" key={project._id}>
                                                            <Td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={urls.DwarkaProjects.some(item => item.projects?._id === project?._id)}
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
                        <div
                            className="d-flex align-items-center justify-content-between"
                            style={{ width: "75%" }}
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
                <form className="table-box top_table_box2" onSubmit={handleSaveAndUpdate}>
                    <div className="table-url-box">
                        <h5>
                            Create Url</h5></div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-floating border_field">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Slug"
                                    value={urls.slug}
                                    name="slug"
                                    onChange={handleInput}
                                    required
                                />
                                <label htmlFor="floatingInput">Slug</label>
                            </div>
                        </div>
                    </div>
                    <div >
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
                                                                urls.DwarkaProjects.map((project, index) => (
                                                                    <Draggable
                                                                        key={project.projects._id}
                                                                        draggableId={project.projects._id}
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
                                                                                    {project?.projects?.name}
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
                    <div className="form-footer btn_width">
                        <button type="submit" className="saveproperty-btn">
                            {isEditable ? "UPDATE" : "SAVE"}
                        </button>
                        <button className="cancel-btn">CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUrls;
