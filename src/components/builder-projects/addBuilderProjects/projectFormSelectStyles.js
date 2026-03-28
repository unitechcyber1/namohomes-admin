/** Shared react-select appearance for Add / Edit project forms */
export const projectFormSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "rgb(251 113 133)" : "rgb(226 232 240)",
    borderWidth: "1px",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(244, 63, 94, 0.12)"
      : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": { borderColor: "rgb(203 213 225)" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    border: "1px solid rgb(226 232 240)",
    boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "rgb(254 242 242)"
      : state.isFocused
        ? "rgb(248 250 252)"
        : "white",
    color: "rgb(15 23 42)",
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    backgroundColor: "rgb(255 241 242)",
  }),
  multiValueLabel: (base) => ({ ...base, color: "rgb(190 18 60)", fontSize: "0.8rem" }),
  placeholder: (base) => ({ ...base, color: "rgb(148 163 184)", fontSize: "0.875rem" }),
  singleValue: (base) => ({ ...base, fontSize: "0.875rem" }),
};
