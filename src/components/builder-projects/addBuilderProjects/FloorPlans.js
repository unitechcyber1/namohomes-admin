import React, { useState, useEffect, Fragment } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { getCategories } from "services/projectService";
import { uploadImageFile } from "../../../services/Services";
import { GpState } from "../../../context/context";
import { FaUpload } from "react-icons/fa";
import { uploadFiles } from "services/mediaService";
const FloorPlans = () => {
  const { projects, setProjects } = GpState();
  const [categories, setCategories] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checkUrl, setCheckUrl] = useState(false)
  const url = window.location.href
  const handleFetchCategory = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const createPlans = () => {
    const currentPlans = projects?.plans || [];
    const newRow = {
      id: currentPlans.length + 1,
      category: "",
      price: "",
      size: "",
      size_sq: "Sq.Ft.",
      image: "",
      floor_plans: [
        {
          id: 1,
          name: "",
          area: "",
          rent_price: "",
          sale_price: "",
          image: "",
        },
      ],
    };
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: [...(prevProjects.plans || []), newRow],
    }));
  };
  const addFloorPlan = (planId) => {
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: (prevProjects.plans || []).map((plan) => {
        if (plan.id === planId) {
          const currentFloorPlans = plan.floor_plans || [];
          const newFloorPlan = {
            id: currentFloorPlans.length + 1,
            name: "",
            area: "",
            rent_price: "",
            sale_price: "",
            image: "",
          };
          return {
            ...plan,
            floor_plans: [...currentFloorPlans, newFloorPlan],
          };
        }
        return plan;
      }),
    }));
  };
  const removePlan = (id) => {
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: (prevProjects.plans || []).filter((row) => row.id !== id),
    }));
  };
  const removeFloorPlan = (planId, floorPlanId) => {
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: (prevProjects.plans || []).map((plan) => {
        if (plan.id === planId) {
          const updatedFloorPlans = (plan.floor_plans || []).filter(
            (floorPlan) => floorPlan.id !== floorPlanId
          );

          return {
            ...plan,
            floor_plans: updatedFloorPlans,
          };
        }
        return plan;
      }),
    }));
  };
  const onChangePlanHandler = (e, id) => {
    const { name, value } = e.target;
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: (prevProjects.plans || []).map((row) => (row.id === id ? { ...row, [name]: value } : row)),
    }));
  };
  const handleInputPlanChange = (e, rowId, planId, isFloorPlan) => {
    const { name, value } = e.target;
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: (prevProjects.plans || []).map((row) => {
        if (row.id === rowId) {
          if (isFloorPlan) {
            return {
              ...row,
              floor_plans: (row.floor_plans || []).map((plan) => {
                if (plan.id === planId) {
                  return { ...plan, [name]: value };
                }
                return plan;
              }),
            };
          } else {
            return { ...row, [name]: value };
          }
        }
        return row;
      }),
    }));
  };

  const previewFile = (data, rowId, planId, isFloorPlan) => {
    const imageUrl = data;
    setProjects((prevProjects) => ({
      ...prevProjects,
      plans: (prevProjects.plans || []).map((row) => {
        if (row.id === rowId) {
          if (isFloorPlan) {
            return {
              ...row,
              floor_plans: (row.floor_plans || []).map((plan) => {
                if (plan.id === planId) {
                  return { ...plan, image: imageUrl[0] };
                }
                return plan;
              }),
            };
          }
        }
        return row;
      }),
    }))
  };
  const handleUploadFile = async (files, rowId, planId, isFloorPlan) => {
    try {
      const data = await uploadFiles(files, {
        compressImages: true,
        onProgress: (percent) => {
          // Upload progress tracking
        },
      });

      previewFile(data, rowId, planId, isFloorPlan);

    } catch (error) {
      // Error handled by uploadFiles function
    }
  };


  const handleInputByClick = (e, rowId, planId, isFloorPlan) => {
    const files = Array.from(e.target.files);
    handleUploadFile(files, rowId, planId, isFloorPlan);
  };
  useEffect(() => {
    if (url.includes('dwarkaexpressway')) {
      setCheckUrl(true)
    } else {
      setCheckUrl(false)
    }
    handleFetchCategory();
  }, [checkUrl])
  return (
    <>
      <div className="d-flex w-50 justify-content-between align-items-center top-margin">
        <h4 className="property_form_h4">Floor Plans & Pricing</h4>
        <IoIosAddCircle
          onClick={createPlans}
          className="icon"
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="project-card">
        <div className="mb-5">
          {(projects?.plans || []).map((row, id) => (
            <div className="row mt-4" key={row.id}>
              <div className="col-12 d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Plan</h5>
                <div className="col-md-2 d-flex align-items-center">
                  <AiFillDelete
                    className="icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => removePlan(row.id)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-control custom-input-height"
                    aria-label="Default select example"
                    name="category"
                    value={row.category}
                    onChange={(e) => onChangePlanHandler(e, row.id)}
                    required
                  >
                    <option>Select Category*</option>
                    {categories?.map((category) => (
                      <option
                        id={category._id}
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="form-floating border_field"
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputPrice"
                    placeholder="Price*"
                    name="price"
                    value={row.price}
                    onChange={(e) => handleInputPlanChange(e, row.id, null, false)}
                    required
                  />
                  <label className="custompadd" htmlFor="floatingInputPrice">Price*</label>
                </div>
              </div>
              <div className="col-md-2">
                <div
                  className="form-floating border_field"
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInputPrice"
                    placeholder="Area*"
                    name="size"
                    value={row.size}
                    onChange={(e) => handleInputPlanChange(e, row.id, null, false)}
                    required
                  />
                  <label className="custompadd" htmlFor="floatingInputPrice">Area</label>
                </div>
              </div>
              <div className="col-md-2">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                    margin: "20px 0",
                  }}
                >
                  <select
                    className="form-control custom-input-height"
                    aria-label="Default select example"
                    name="size_sq"
                    value={row.size_sq}
                    onChange={(e) => handleInputPlanChange(e, row.id, null, false)}
                    required
                  >
                    <option>Sq.Ft.</option>
                    <option>Sq.Yd.</option>
                    <option>Ft.</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <h5>Floor Plans</h5>
                </div>
                <div className="col-md-3">
                  <IoIosAddCircle
                    onClick={() => addFloorPlan(row.id)}
                    className="icon"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              {(row.floor_plans || []).map((plan, id) => (
                <div className="row" key={plan.id}>
                  <div className="col-md-2">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputPrice"
                        placeholder="Name*"
                        name="name"
                        value={plan.name}
                        //  onChange={(e) => handleInputPlanChange(e, row.id, plan.id)}
                        onChange={(e) => handleInputPlanChange(e, row.id, plan.id, true)}
                      />
                      <label className="custompadd" htmlFor="floatingInputPrice">Name</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputPrice"
                        placeholder="Area*"
                        name="area"
                        value={plan.area}
                        //  onChange={(e) => handleInputPlanChange(e, row.id, plan.id)}
                        onChange={(e) => handleInputPlanChange(e, row.id, plan.id, true)}
                      />
                      <label className="custompadd" htmlFor="floatingInputPrice">Area</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputPrice"
                        placeholder="Rent Price*"
                        name="rent_price"
                        value={plan.rent_price}
                        onChange={(e) => handleInputPlanChange(e, row.id, plan.id, true)}
                      />
                      <label className="custompadd" htmlFor="floatingInputPrice">Rent Price*</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div
                      className="form-floating border_field"
                      style={{ marginTop: "6px" }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputPrice"
                        placeholder="Sale Price*"
                        name="sale_price"
                        value={plan.sale_price}
                        onChange={(e) => handleInputPlanChange(e, row.id, plan.id, true)}
                      />
                      <label className="custompadd" htmlFor="floatingInputPrice">Sale Price*</label>
                    </div>
                  </div>
                  <div className="col-md-2"
                    style={{
                      padding: "10px"
                    }}
                  >
                    <label className="file file_label">
                      <span className="upload_text">Upload</span>
                      <FaUpload className="upload_icon" />
                      <input
                        type="file"
                        id={`file-input-${plan.id}`}
                        aria-label="File browser example"
                        onChange={(e) => handleInputByClick(e, row.id, plan.id, true)}
                        className="file_hide"
                      />
                    </label>
                    <div
                      id={`preview-${plan.id}`}
                      className="mt-3 d-flex align-items-center"
                    >
                      {(plan.image || plan.image?.s3_link) && <Fragment>
                        <img src={plan.image?.s3_link || plan.image} alt="media" width="50%" />
                      </Fragment>}
                    </div>
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <AiFillDelete
                      className="icon"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFloorPlan(row.id, plan.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FloorPlans;
