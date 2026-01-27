import React, { useState, useEffect, useContext, createContext } from "react";
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
    Cookies.set("token", authToken);
    Cookies.set("userInfo", JSON.stringify(userData));
    setUserInfo(userData);
    setToken(authToken);
  };
  let isLogin = !!Cookies.get("token");
  const logout = () => {
    setUserInfo(null);
    setToken(null);
    Cookies.remove("userInfo");
    Cookies.remove("token");
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
