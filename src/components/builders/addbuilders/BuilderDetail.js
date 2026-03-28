import React from "react";
import { GpState } from "../../../context/context";

const BuilderDetail = () => {
  const { builder, setBuilder } = GpState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuilder({
      ...builder,
      [name]: value,
    });
  };

  return (
    <div className="saas-card">
      <div className="saas-card-header">
        <div>
          <div className="saas-card-title">Basic information</div>
          <div className="saas-card-subtitle">
            Name, slug, pricing, and key stats shown on the builder profile.
          </div>
        </div>
      </div>
      <div className="saas-card-body space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-name"
              placeholder="Name*"
              name="name"
              value={builder?.name ?? ""}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="builder-name">Name of builder</label>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-slug"
              placeholder="Slug*"
              name="slug"
              value={builder?.slug ?? ""}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="builder-slug">Slug</label>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-starting-price"
              placeholder="Starting price"
              name="starting_price"
              value={builder?.starting_price ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-starting-price">Starting price</label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-configuration"
              placeholder="Configuration"
              name="configuration"
              value={builder?.configuration ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-configuration">Configuration</label>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-ratings"
              placeholder="Ratings"
              name="ratings"
              value={builder?.ratings ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-ratings">Ratings</label>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-dwarka-slug"
              placeholder="Dwarka page slug"
              name="dwarka_page_url"
              value={builder?.dwarka_page_url ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-dwarka-slug">Dwarka page slug</label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-estb-year"
              placeholder="Establish year"
              name="estb_year"
              value={builder?.estb_year ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-estb-year">Establish year</label>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-residential"
              placeholder="Residential projects"
              name="residential_num"
              value={builder?.residential_num ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-residential">Residential projects</label>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-commercial"
              placeholder="Commercial projects"
              name="commercial_num"
              value={builder?.commercial_num ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-commercial">Commercial projects</label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-coming-soon"
              placeholder="Coming soon"
              name="coming_soon"
              value={builder?.coming_soon ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="builder-coming-soon">Coming soon</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderDetail;
