import React, { useState, useEffect } from "react";
import { GpState } from "../../../context/context";

const BuilderDetail = () => {
  const { builder, setBuilder, editBuilder, isBuilderEditable } = GpState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuilder({
      ...builder,
      [name]: value,
    });
  };
  return (
    <>
      {" "}
      <div className="row mt-4">
        <div className="col-md-12">
          <h4>Builder Details</h4>
        </div>
      </div>
      <div className="row d-flex align-items-baseline">
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Name*"
              name="name"
              value={builder?.name}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="floatingInput">Name of Builder</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputSlug"
              placeholder="Slug*"
              name="slug"
              value={builder?.slug}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="floatingInputSlug">Slug</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Starting Prices*"
              name="starting_price"
              value={builder?.starting_price}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Starting Price*</label>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Configuration*"
              name="configuration"
              value={builder?.configuration}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Configuration*</label>
          </div>
        </div>
        {/* <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Project Size"
              name="project_size"
              value={builder.project_size}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Project Size*</label>
          </div>
        </div> */}
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Ratings"
              name="ratings"
              value={builder?.ratings}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Ratings</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputSlug"
              placeholder="Dwarka Page Slug*"
              name="dwarka_page_url"
              value={builder?.dwarka_page_url}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputSlug">Dwarka Page Slug</label>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputSlug"
              placeholder="Establish Year"
              name="estb_year"
              value={builder?.estb_year}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputSlug">Establish Year</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Residential Project"
              name="residential_num"
              value={builder?.residential_num}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Residential Project</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Commertial Project"
              name="commercial_num"
              value={builder?.commercial_num}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Commertial Project</label>
          </div>
        </div>
      </div>
      <div className="row mt-4 d-flex align-items-baseline">
        <div className="col-md-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputAddress"
              placeholder="Coming Soon"
              name="coming_soon"
              value={builder?.coming_soon}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInputAddress">Coming Soon</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuilderDetail;
