import { IoEarthOutline } from "react-icons/io5";
import { BiMapPin } from "react-icons/bi";
import { GiModernCity } from "react-icons/gi";
import { HiOutlineCash } from "react-icons/hi";
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { MdOutlinePermMedia, MdOutlineRealEstateAgent } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

const Sidebar = () => {
  const propularityTabs = [
    { link: "/builder-projects", icon: <HiOutlineBuildingOffice className="icon" />, label: "Builder Projects" },
    { link: "/priority", icon: <HiOutlineBuildingOffice className="icon" />, label: "Projects Priority" },
    { link: "/priority-india", icon: <HiOutlineBuildingOffice className="icon" />, label: "Projects India" },
    { link: "/top-projects", icon: <HiOutlineBuildingOffice className="icon" />, label: "Top Projects" },
    { link: "/builder-priority", icon: <HiOutlineBuildingOffice className="icon" />, label: "Builder Priority" },
    { link: "/plans-priority", icon: <HiOutlineBuildingOffice className="icon" />, label: "Plans Priority" },
    { link: "/priority-microlocation", icon: <IoLocationOutline className="icon" />, label: "Location Priority" },
    { link: "/seo", icon: <MdOutlineRealEstateAgent className="icon" />, label: "SEO" },
    { link: "/clients", icon: <MdOutlineRealEstateAgent className="icon" />, label: "Our Clients" },
    { link: "/media", icon: <MdOutlinePermMedia className="icon" />, label: "Media" },
    { link: "/builder", icon: <MdOutlineRealEstateAgent className="icon" />, label: "Builder" },
    { link: "/builder-plan", icon: <HiOutlineBuildingOffice className="icon" />, label: "Project Types" },
    { link: "/country", icon: <IoEarthOutline className="icon" />, label: "Country" },
    { link: "/state", icon: <BiMapPin className="icon" />, label: "State" },
    { link: "/city", icon: <GiModernCity className="icon" />, label: "City" },
    { link: "/microlocation", icon: <IoLocationOutline className="icon" />, label: "Location" },
    { link: "/amenities", icon: <HiOutlineCash className="icon" />, label: "Amenities" }
  ];

  return (
    <div className="sidebar">
      <div className="sidenav">
        <ul className="nav-menu-wrapper">
          {propularityTabs.map((item, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `dropdown-item ${isActive ? "active" : ""}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

