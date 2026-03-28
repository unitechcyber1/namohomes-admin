import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { getCategories } from "../../../services/projectService";
import { GpState } from "../../../context/context";
import { FaUpload } from "react-icons/fa";
import { uploadFiles } from "../../../services/mediaService";

const FloorPlans = () => {
  const { projects, setProjects } = GpState();
  const [categories, setCategories] = useState([]);

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
          is_sold: false,
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
            is_sold: false,
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
      plans: (prevProjects.plans || []).map((row) =>
        row.id === id ? { ...row, [name]: value } : row
      ),
    }));
  };

  const handleInputPlanChange = (e, rowId, planId, isFloorPlan) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;
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
          }
          return { ...row, [name]: value };
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
    }));
  };

  const handleUploadFile = async (files, rowId, planId, isFloorPlan) => {
    try {
      const data = await uploadFiles(files, {
        compressImages: true,
        onProgress: () => {},
      });
      previewFile(data, rowId, planId, isFloorPlan);
    } catch {
      // uploadFiles / caller may surface errors
    }
  };

  const handleInputByClick = (e, rowId, planId, isFloorPlan) => {
    const files = Array.from(e.target.files);
    handleUploadFile(files, rowId, planId, isFloorPlan);
  };

  useEffect(() => {
    handleFetchCategory();
  }, []);

  const plans = projects?.plans || [];

  return (
    <div className="saas-card add-project-form-shell">
      <div className="saas-card-header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="saas-card-title">Floor plans & pricing</div>
          <div className="saas-card-subtitle">
            Add plan groups (category, price, area), then one or more floor-plan
            units with rent/sale pricing and optional layout image.
          </div>
        </div>
        <button
          type="button"
          onClick={createPlans}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60"
        >
          <BsPlusLg className="text-rose-600" aria-hidden />
          Add plan
        </button>
      </div>

      <div className="saas-card-body space-y-4">
        {plans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center text-sm text-slate-500">
            No plans yet. Use <span className="font-medium text-slate-700">Add plan</span>{" "}
            to create your first pricing tier.
          </div>
        ) : (
          plans.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Plan</h3>
                <button
                  type="button"
                  onClick={() => removePlan(row.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  aria-label="Remove plan"
                  title="Remove plan"
                >
                  <AiFillDelete className="text-lg" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="project-field-block">
                  <label className="saas-label" htmlFor={`plan-cat-${row.id}`}>
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id={`plan-cat-${row.id}`}
                    className="project-native-select"
                    name="category"
                    value={row.category}
                    onChange={(e) => onChangePlanHandler(e, row.id)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="project-field-block">
                  <label className="saas-label" htmlFor={`plan-price-${row.id}`}>
                    Price <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id={`plan-price-${row.id}`}
                    type="text"
                    name="price"
                    value={row.price}
                    onChange={(e) => handleInputPlanChange(e, row.id, null, false)}
                    placeholder="e.g. 1.25 Cr"
                    className="saas-input"
                    required
                  />
                </div>
                <div className="project-field-block">
                  <label className="saas-label" htmlFor={`plan-size-${row.id}`}>
                    Area
                  </label>
                  <input
                    id={`plan-size-${row.id}`}
                    type="text"
                    name="size"
                    value={row.size}
                    onChange={(e) => handleInputPlanChange(e, row.id, null, false)}
                    placeholder="e.g. 1200"
                    className="saas-input"
                  />
                </div>
                <div className="project-field-block">
                  <label className="saas-label" htmlFor={`plan-unit-${row.id}`}>
                    Unit
                  </label>
                  <select
                    id={`plan-unit-${row.id}`}
                    className="project-native-select"
                    name="size_sq"
                    value={row.size_sq}
                    onChange={(e) => handleInputPlanChange(e, row.id, null, false)}
                    required
                  >
                    <option value="Sq.Ft.">Sq.Ft.</option>
                    <option value="Sq.Yd.">Sq.Yd.</option>
                    <option value="Ft.">Ft.</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Floor plans
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Units under this plan (BHK types, floors, etc.)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addFloorPlan(row.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-rose-200 hover:bg-white"
                  >
                    <BsPlusLg className="text-rose-600" aria-hidden />
                    Add unit
                  </button>
                </div>

                <div className="space-y-3">
                  {(row.floor_plans || []).map((plan) => {
                    const imgSrc =
                      plan.image?.s3_link ||
                      (typeof plan.image === "string" ? plan.image : null);
                    return (
                      <div
                        key={plan.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                      >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                          <div className="project-field-block lg:col-span-2">
                            <label
                              className="saas-label"
                              htmlFor={`fp-name-${row.id}-${plan.id}`}
                            >
                              Name
                            </label>
                            <input
                              id={`fp-name-${row.id}-${plan.id}`}
                              type="text"
                              name="name"
                              value={plan.name}
                              onChange={(e) =>
                                handleInputPlanChange(e, row.id, plan.id, true)
                              }
                              placeholder="e.g. 3 BHK"
                              className="saas-input"
                            />
                          </div>
                          <div className="project-field-block lg:col-span-2">
                            <label
                              className="saas-label"
                              htmlFor={`fp-area-${row.id}-${plan.id}`}
                            >
                              Area
                            </label>
                            <input
                              id={`fp-area-${row.id}-${plan.id}`}
                              type="text"
                              name="area"
                              value={plan.area}
                              onChange={(e) =>
                                handleInputPlanChange(e, row.id, plan.id, true)
                              }
                              placeholder="Size"
                              className="saas-input"
                            />
                          </div>
                          <div className="project-field-block lg:col-span-2">
                            <label
                              className="saas-label"
                              htmlFor={`fp-rent-${row.id}-${plan.id}`}
                            >
                              Rent price <span className="text-rose-600">*</span>
                            </label>
                            <input
                              id={`fp-rent-${row.id}-${plan.id}`}
                              type="text"
                              name="rent_price"
                              value={plan.rent_price}
                              onChange={(e) =>
                                handleInputPlanChange(e, row.id, plan.id, true)
                              }
                              placeholder="Rent"
                              className="saas-input"
                            />
                          </div>
                          <div className="project-field-block lg:col-span-2">
                            <label
                              className="saas-label"
                              htmlFor={`fp-sale-${row.id}-${plan.id}`}
                            >
                              Sale price <span className="text-rose-600">*</span>
                            </label>
                            <input
                              id={`fp-sale-${row.id}-${plan.id}`}
                              type="text"
                              name="sale_price"
                              value={plan.sale_price}
                              onChange={(e) =>
                                handleInputPlanChange(e, row.id, plan.id, true)
                              }
                              placeholder="Sale"
                              className="saas-input"
                            />
                          </div>
                          <div className="flex items-center lg:col-span-1">
                            <label
                              htmlFor={`fp-sold-${row.id}-${plan.id}`}
                              className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-1 py-2"
                            >
                              <input
                                id={`fp-sold-${row.id}-${plan.id}`}
                                type="checkbox"
                                name="is_sold"
                                checked={Boolean(plan.is_sold)}
                                onChange={(e) =>
                                  handleInputPlanChange(e, row.id, plan.id, true)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
                              />
                              <span className="text-sm font-medium text-slate-800">
                                Sold
                              </span>
                            </label>
                          </div>
                          <div className="project-field-block lg:col-span-2">
                            <span className="saas-label">Layout image</span>
                            <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/50">
                              <FaUpload className="text-rose-600" aria-hidden />
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) =>
                                  handleInputByClick(e, row.id, plan.id, true)
                                }
                              />
                            </label>
                            {imgSrc && (
                              <div className="mt-2">
                                <img
                                  src={imgSrc}
                                  alt=""
                                  className="max-h-24 w-auto max-w-full rounded-lg border border-slate-200 object-contain"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end lg:col-span-1">
                            <button
                              type="button"
                              onClick={() => removeFloorPlan(row.id, plan.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                              aria-label="Remove floor plan"
                              title="Remove"
                            >
                              <AiFillDelete />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FloorPlans;
