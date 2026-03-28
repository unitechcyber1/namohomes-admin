import React, { useEffect, useState, useMemo } from "react";
import { getAmenities } from "../../../services/projectService";
import { GpState } from "../../../context/context";

/** Keep in sync with AddBuilderprojects / Project details (API casing varies). */
const normalizeProjectType = (t) => {
  const s = String(t ?? "").trim().toLowerCase();
  return s === "commercial" ? "commercial" : "residential";
};

const ProjectAmenities = () => {
  const { setProjects, projects } = GpState();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  const projectTypeKey = useMemo(
    () => normalizeProjectType(projects?.project_type),
    [projects?.project_type]
  );

  const selectedIds = useMemo(() => {
    const raw =
      projectTypeKey === "residential"
        ? projects?.allAmenities?.residential
        : projects?.allAmenities?.commercial;
    if (!Array.isArray(raw)) return [];
    return raw.map((id) => String(id));
  }, [projectTypeKey, projects?.allAmenities]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params =
      projectTypeKey === "commercial"
        ? { isCommercial: true }
        : { isResidential: true };

    (async () => {
      try {
        const data = await getAmenities(params);
        if (!cancelled) {
          const list = Array.isArray(data)
            ? data
            : data?.amenities ?? data?.data ?? [];
          setAmenities(Array.isArray(list) ? list : []);
        }
      } catch {
        if (!cancelled) setAmenities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projectTypeKey]);

  const handleCheckboxChange = (event) => {
    const checkedAmenityId = String(event.target.value);
    const isChecked = event.target.checked;
    const type = normalizeProjectType(projects?.project_type);

    if (isChecked) {
      setProjects((prev) => ({
        ...prev,
        allAmenities: {
          residential:
            type === "residential"
              ? [...(prev.allAmenities?.residential || []).map(String), checkedAmenityId]
              : (prev.allAmenities?.residential || []).map(String),
          commercial:
            type === "commercial"
              ? [...(prev.allAmenities?.commercial || []).map(String), checkedAmenityId]
              : (prev.allAmenities?.commercial || []).map(String),
        },
      }));
    } else {
      setProjects((prev) => ({
        ...prev,
        allAmenities: {
          residential:
            type === "residential"
              ? (prev.allAmenities?.residential || [])
                  .map(String)
                  .filter((id) => id !== checkedAmenityId)
              : (prev.allAmenities?.residential || []).map(String),
          commercial:
            type === "commercial"
              ? (prev.allAmenities?.commercial || [])
                  .map(String)
                  .filter((id) => id !== checkedAmenityId)
              : (prev.allAmenities?.commercial || []).map(String),
        },
      }));
    }
  };

  const subtitle =
    projectTypeKey === "commercial"
      ? "Commercial-only amenities for this project (list reloads when you change project type)."
      : "Residential-only amenities for this project (list reloads when you change project type).";

  return (
    <div className="saas-card add-project-form-shell">
      <div className="saas-card-header">
        <div>
          <div className="saas-card-title">Project amenities</div>
          <div className="saas-card-subtitle">{subtitle}</div>
          <div className="mt-2 inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            Type:{" "}
            <span className="ml-1 capitalize text-slate-900">{projectTypeKey}</span>
          </div>
        </div>
      </div>
      <div className="saas-card-body">
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-slate-500">
            Loading {projectTypeKey} amenities…
          </div>
        ) : !amenities?.length ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-slate-500">
            No {projectTypeKey} amenities found. Add some under Amenities in the admin
            menu, or check API filters.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => {
              const id = `amenity_${amenity._id}`;
              const amenityId = String(amenity._id);
              const checked = selectedIds.includes(amenityId);
              return (
                <li key={amenity._id} className="list-none">
                  <label
                    htmlFor={id}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80"
                  >
                    <input
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500/35"
                      type="checkbox"
                      value={amenityId}
                      id={id}
                      name="amenity"
                      onChange={handleCheckboxChange}
                      checked={checked}
                    />
                    <span className="min-w-0 flex-1 text-left text-sm font-medium leading-snug text-slate-800">
                      {amenity.name}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectAmenities;
