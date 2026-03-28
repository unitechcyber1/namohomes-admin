import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import ListingSpace from "./components/listing-space/ListingSpace";
import BuilderPlan from "./components/builder-plan/BuilderPlan";
import Media from "./components/media/Media";
import Country from "./components/country/Country";
import State from "./components/state/State";
import City from "./components/city/City";
import Microlocation from "./components/microlocation/Microlocation";
import Amenities from "./components/amenities/Amenities";
import Login from "./components/login-page/Login";
import React from "react";
import { GpState } from "./context/context";
import AddBuilderprojects from "./components/builder-projects/addBuilderProjects/AddBuilderprojects";
import BuilderProjects from "./components/builder-projects/BuilderProjects";
import Builder from "./components/builders/Builder";
import Seo from "./components/SEO/Seo";
import AddSeoForm from "./components/SEO/AddSeoForm";
import ImageUpload from "./ImageUpload";
import ForgotPassword from "./components/login-page/ForgotPassword";
import PasswordReset from "./components/login-page/PasswordReset";
import AddBuilder from "./components/builders/addbuilders/AddBuilder";      
import NewLaunch from "./components/new-launch-projects/NewLaunch";
import DashboardLayout from "./components/layout/DashboardLayout";
function App() {
  const { isLogin } = GpState();
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={!isLogin ? <Login /> : <Navigate to="/builder-projects" />}
      />
      <Route
        path="/"
        element={!isLogin ? <Login /> : <Navigate to="/builder-projects" />}
      />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />

      {/* Protected */}
      <Route
        element={isLogin ? <DashboardLayout /> : <Navigate to="/" />}
      >
        <Route path="/listing-space" element={<ListingSpace />} />
        <Route path="/builder-projects" element={<BuilderProjects />} />
        <Route path="/builder-plan" element={<BuilderPlan />} />
        <Route path="/media" element={<Media />} />
        <Route path="/country" element={<Country />} />
        <Route path="/state" element={<State />} />
        <Route path="/city" element={<City />} />
        <Route path="/microlocation" element={<Microlocation />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/seo" element={<Seo />} />
        <Route path="/builder-projects/add-builder-projects" element={<AddBuilderprojects />} />
        <Route path="/seo/add-seo" element={<AddSeoForm />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/seo/editseo/:id" element={<AddSeoForm />} />
        <Route path="/builder/add-builder" element={<AddBuilder />} />
        <Route path="/builder/edit-builder/:id" element={<AddBuilder />} />
        <Route path="/builder-projects/edit-project/:id" element={<AddBuilderprojects />} />
        <Route path="/image" element={<ImageUpload />} />
        <Route path="/new-launch-projects" element={<NewLaunch />} />
      </Route>
    </Routes>
  );
}

export default App;
