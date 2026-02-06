import React, { useEffect, useState } from "react";
import { GpState } from "../../../context/context";
const ProjectSeo = () => {
  const {projects,setProjects } = GpState();
  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;
    setProjects((prevProjects) => {
      const updatedProjects = { ...prevProjects };
      if (!updatedProjects[section]) {
        updatedProjects[section] = {};
      }
      if (subSection) {
        if (!updatedProjects[section][subSection]) {
          updatedProjects[section][subSection] = {};
        }
        updatedProjects[section][subSection][name] = type === 'checkbox' ? checked : value;
      } else {
        updatedProjects[section][name] = type === 'checkbox' ? checked : value;
      }
      if (section === 'seo' && name === 'index') {
        updatedProjects[section].robots = checked ? 'index, follow' : 'noindex, nofollow';
      }
  
      return updatedProjects;
    });
  };
  
  return (
    <>
      {" "}
      <div className="project-card">
      <div className="row ">
        <h4 className="property_form_h4">SEO Details</h4>
        <div className="col-md-6">
          <div className="form-floating seo_floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputTitle"
              placeholder="Title"
              name="title"
              value={projects?.seo?.title}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label className="custompadd" htmlFor="floatingInput">Title</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputKeywords"
              placeholder="Keywords"
              name="keywords"
              value={projects?.seo?.keywords}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label className="custompadd" htmlFor="floatingInput">Keywords</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputDescription"
              placeholder="Description"
              name="description"
              value={projects?.seo?.description}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label className="custompadd" htmlFor="floatingInputDescription">Description</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputTwitter"
              placeholder="Twitter Title"
              name="title"
              value={projects?.seo?.twitter?.title || ""}
              onChange={(e) => handleInputChange(e, 'seo', 'twitter')}
            />
            <label className="custompadd" htmlFor="floatingInputTwitter">Twitter Title</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputTwitDesc"
              placeholder="Twitter Description"
              name="description"
              value={projects?.seo?.twitter?.description}
              onChange={(e) => handleInputChange(e, 'seo', 'twitter')}
            />
            <label className="custompadd" htmlFor="floatingInputTwitDesc">Twitter Description</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputOgTitle"
              placeholder="Open Graph Title"
              name="title"
              value={projects?.seo?.open_graph?.title}
              onChange={(e) => handleInputChange(e, 'seo', 'open_graph')}
            />
            <label className="custompadd" htmlFor="floatingInputOgTitle">Open Graph Title</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputOgDesc"
              placeholder="Open Graph Description"
              name="description"
              value={projects?.seo?.open_graph?.description}
              onChange={(e) => handleInputChange(e, 'seo', 'open_graph')}
            />
            <label className="custompadd" htmlFor="floatingInputOgDesc">Open Graph Description</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating seo_floating border_field">
            <textarea
              type="text"
              className="form-control schema_hight"
              id="floatingInputOgDesc"
              placeholder="Schema"
              name="script"
              value={projects?.seo?.script}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label className="custompadd" htmlFor="floatingInputOgDesc">Schema</label>
          </div>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-md-6">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="index"
              id="flexCheckDefault"
              checked={projects?.seo?.index}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Check for indexing this Page
            </label>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProjectSeo;
