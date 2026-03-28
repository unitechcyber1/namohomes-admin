import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { GpState } from "../../../context/context";
const ContactDetails = () => {
  const { projects, setProjects } = GpState();
  const createContact = () => {
    const newRow = {
      id: projects.contact_details.length + 1,
      user: "",
      email: "",
      phone: "",
      designation: "",
    };
    setProjects((prevProjects) => ({
      ...prevProjects,
      contact_details: [...prevProjects.contact_details, newRow],
    }));
  };
  const removeContact = (id) => {
    setProjects((prevProjects) => ({
      ...prevProjects,
      contact_details: prevProjects.contact_details.filter((row) => row.id !== id)
    }));
  };
  const handleInputContactChange = (e, id) => {
    const { name, value } = e.target;
    setProjects((prevProjects) => ({
      ...prevProjects,
      contact_details: prevProjects.contact_details.map((row) => (row.id === id ? { ...row, [name]: value } : row)),
    }));
  };
  return (
    <>
      <div className="saas-card add-project-form-shell">
        <div className="saas-card-header">
          <div>
            <div className="saas-card-title">Basic Info</div>
            <div className="saas-card-subtitle">
              Add the primary contact(s) for this project.
            </div>
          </div>
          <button
            type="button"
            onClick={createContact}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <IoIosAddCircle className="text-lg" />
            Add contact
          </button>
        </div>

        <div className="saas-card-body">
          <div className="space-y-3">
            {projects.contact_details?.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 md:grid-cols-12 md:items-end"
              >
                <div className="md:col-span-3">
                  <div className="form-floating border_field">
                    <input
                      type="text"
                      className="form-control"
                      id={`contactUser-${row.id}`}
                      placeholder="Name"
                      name="user"
                      value={row.user}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor={`contactUser-${row.id}`}>Name</label>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="form-floating border_field">
                    <input
                      type="text"
                      className="form-control"
                      id={`contactEmail-${row.id}`}
                      placeholder="Email"
                      name="email"
                      value={row.email}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor={`contactEmail-${row.id}`}>Email</label>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="form-floating border_field">
                    <input
                      type="text"
                      className="form-control"
                      id={`contactPhone-${row.id}`}
                      placeholder="Phone"
                      name="phone"
                      value={row.phone}
                      onChange={(e) => handleInputContactChange(e, row.id)}
                    />
                    <label htmlFor={`contactPhone-${row.id}`}>Phone</label>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="form-floating border_field flex-1">
                      <input
                        type="text"
                        className="form-control"
                        id={`contactRelation-${row.id}`}
                        placeholder="Relation"
                        name="designation"
                        value={row.designation}
                        onChange={(e) => handleInputContactChange(e, row.id)}
                      />
                      <label htmlFor={`contactRelation-${row.id}`}>Relation</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContact(row.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                      aria-label="Remove contact"
                      title="Remove"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!projects.contact_details || projects.contact_details.length === 0) && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/30 px-4 py-6 text-sm text-slate-600">
              No contacts added yet. Click <span className="font-semibold">Add contact</span> to create one.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactDetails;
