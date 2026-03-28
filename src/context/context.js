import React, { useState, useContext, createContext } from "react";
import Cookies from "js-cookie";
import {builders} from "../models/builderModel"
import { project } from "../models/builderProjectModel";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [editProject, setEditProject] = useState({});
  const [showModal, setShow] = useState(false);
  const [country, setCountry] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState(project);
  const [builder, setBuilder] = useState(builders);
  const [selectedMicroLocation, setSelectedMicroLocation] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const login = (userData, authToken) => {
    // Ensure cookies are available across all routes/tabs.
    // Without an explicit path, cookies can default to the current route (e.g. /login),
    // which breaks auth when opening deep links in a new tab.
    const cookieOptions = {
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    };
    Cookies.set("token", authToken, cookieOptions);
    Cookies.set("userInfo", JSON.stringify(userData), cookieOptions);
    setUserInfo(userData);
    setToken(authToken);
  };
  let isLogin = !!Cookies.get("token");
  const logout = () => {
    setUserInfo(null);
    setToken(null);
    const cookieOptions = {
      path: "/",
    };
    Cookies.remove("userInfo", cookieOptions);
    Cookies.remove("token", cookieOptions);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editBuilder, setEditBuilder] = useState({});
  const [isBuilderEditable, setIsBuilderEditable] = useState(false);
  const [builderImage, setBuilderImage] = useState([]);
  const [aboutEditor, SetAboutEditor] = useState("")
  const [footer_des, setFooter_des] = useState("")
  const allValues = {
    userInfo,
    token,
    login,
    handleClose,
    handleShow,
    showModal,
    isLogin,
    logout,
    country,
    setCountry,
    projects,
    setProjects,
    selectedMicroLocation,
    setSelectedMicroLocation,
    selectedState,
    setSelectedState,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    editProject,
    setEditProject,
    isEditable,
    setIsEditable,
    builder,
    setBuilder,
    builderImage,
    setBuilderImage,
    editBuilder,
    setEditBuilder,
    isBuilderEditable,
    setIsBuilderEditable,
    aboutEditor, SetAboutEditor,
    footer_des, setFooter_des
  };

  return (
    <AppContext.Provider value={allValues}>{children}</AppContext.Provider>
  );
};

export const GpState = () => {
  return useContext(AppContext);
};

export default AppProvider;
