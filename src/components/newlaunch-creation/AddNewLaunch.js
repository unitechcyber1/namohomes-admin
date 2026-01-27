import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { useToast } from "@chakra-ui/react";
import { getProjectData } from "../builder-projects/ProjectService";
import { useParams } from "react-router-dom";
import { getUrlById, saveUrls, updatedUrls } from "./NewLaunchService";
function AddNewLaunch() {
    const [loadingTable, setLoadingTable] = useState(false);
    const [isEditable, setIsEditable] = useState(false)
    const [urlById, setUrlById] = useState({})
    const [newlaunch, setNewlaunch] = useState({
        name: "",
        configuration: "",
        starting_price: "",
        tagline: ""
    })
    const toast = useToast();
    const url = window.location.href
    const { id } = useParams()
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
            setNewlaunch({ ...urlById })
        }
        else {
            setNewlaunch({
                slug: "", DwarkaProjects: [],
                city: "650028ee87a793abe11b8a98"
            });
        }
    }, [urlById]);
    const handleInput = (e) => {
        const { name, value } = e.target;
        setNewlaunch({
            ...newlaunch,
            [name]: value,
        });
    };
    const handleSaveAndUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isEditable) {
                if (url.includes('dwarkaexpressway')) {
                    await updatedUrls(id, newlaunch)
                }
            } else {
                if (url.includes('dwarkaexpressway')) {
                    await saveUrls(newlaunch)
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
    return (
        <div className="mx-5 mt-3">
            <Mainpanelnav />
            <div className="table_container">
                <form className="table-box top_table_box2" onSubmit={handleSaveAndUpdate}>
                    <div className="table-url-box">
                        <h5>
                            Create New Launch Ad</h5></div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-floating border_field">    
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Name"
                                    value={newlaunch.name}
                                    name="name"
                                    onChange={handleInput}
                                    required
                                />
                                <label htmlFor="floatingInput">Name</label>
                            </div>
                            <div className="form-floating border_field">    
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Configuration"
                                    value={newlaunch.configuration}
                                    name="configuration"
                                    onChange={handleInput}
                                />
                                <label htmlFor="floatingInput">Configuration</label>
                            </div>
                            <div className="form-floating border_field">    
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Starting Price"
                                    value={newlaunch.starting_price}
                                    name="starting_price"
                                    onChange={handleInput}
                                />
                                <label htmlFor="floatingInput">Starting Price</label>
                            </div>
                            <div className="form-floating border_field">    
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Tag Line"
                                    value={newlaunch.tagline}
                                    name="tagline"
                                    onChange={handleInput}
                                />
                                <label htmlFor="floatingInput">Tag Line</label>
                            </div>

                        </div>
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

export default AddNewLaunch;
