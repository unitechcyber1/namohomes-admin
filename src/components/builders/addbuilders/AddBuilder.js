import React, { useEffect, useState } from "react";
import Mainpanelnav from "../../mainpanel-header/Mainpanelnav";
import BuilderDetail from "./BuilderDetail";
import BuilderSeo from "./BuilderSeo";
import BuilderImage from "./BuilderImage";
import ImageUpload from "../../../ImageUpload";

import Select from "react-select";
import { useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { uploadFile } from "../../../services/Services";
import { GpState } from "../../../context/context";
import Loader from "../../loader/Loader";

import {
  getCities,
  getBuilderById,
  createBuilder,
  updateBuilder
} from "../../../services/builderService";

import { builders as builderModel } from "../../../models/builderModel";

const AddBuilder = () => {
  const toast = useToast();
  const { id } = useParams();

  const {
    builder,
    builderImage,
    footer_des,
    editBuilder,
    setEditBuilder,
    isBuilderEditable,
    setIsBuilderEditable,
    aboutEditor,
    setBuilder
  } = GpState();

  const [images, setImages] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------- Upload ----------
  const previewFile = (data) => {
    setImages((prev) => prev.concat(data));
  };

  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };

  // ---------- Fetch Cities ----------
  const fetchCities = async () => {
    try {
      const data = await getCities();
      setCities(data);
    } catch {
      toast({ title: "City load failed", status: "error" });
    }
  };

  // ---------- Fetch Builder ----------
  const fetchBuilder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setIsBuilderEditable(true);

      const data = await getBuilderById(id);
      setEditBuilder(data);

    } catch {
      toast({ title: "Builder load failed", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchBuilder();

    if (!id) {
      setEditBuilder({});
      setIsBuilderEditable(false);
      setLoading(false);
    }
  }, []);

  // ---------- Sync Builder Model ----------
  useEffect(() => {
    if (editBuilder && isBuilderEditable) {
      setBuilder({ ...editBuilder });
    } else {
      setBuilder(builderModel);
    }
  }, [editBuilder]);

  // ---------- City Select ----------
  const cityOptions = cities.map(c => ({
    value: c._id,
    label: c.name,
  }));

  useEffect(() => {
    if (!isBuilderEditable) return;

    const selected = cityOptions.filter(opt =>
      editBuilder?.cities?.includes(opt.value)
    );

    setSelectedCity(selected);
  }, [cities, editBuilder]);

  const allCityIds = selectedCity?.map(c => c.value);

  // ---------- Payload ----------
  const payload = {
    ...builder,
    description: footer_des,
    about_builder: aboutEditor,
    images: builderImage,
    BuilderLogo: images[0],
    cities: allCityIds,
  };

  // ---------- Save ----------
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await createBuilder(payload);

      toast({
        title: "Saved Successfully!",
        status: "success",
      });

    } catch (e) {
      toast({
        title: "Save failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  // ---------- Update ----------
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateBuilder(id, payload);

      toast({
        title: "Updated Successfully!",
        status: "success",
      });

    } catch (e) {
      toast({
        title: "Update failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  if (loading && isBuilderEditable) return <Loader />;

  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <div className="container form-box">
        <form onSubmit={isBuilderEditable ? handleUpdate : handleSave}>

          <div className="row mt-4">
            <BuilderDetail />
          </div>

          {/* City Select */}
          <div className="row mt-4">
            <h5>Select City</h5>
            <div className="col-md-6">
              <Select
                value={selectedCity}
                options={cityOptions}
                onChange={setSelectedCity}
                isMulti
                isSearchable
                required
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="row mt-4">
            <div className="col-md-6">
              <h5>Builder Logo</h5>

              <ImageUpload
                images={images}
                setImages={setImages}
                progress={progress}
                setProgress={setProgress}
                uploadFile={handleUploadFile}
                isUploaded={isUploaded}
              />
            </div>

            {editBuilder?.BuilderLogo && (
              <img
                src={editBuilder.BuilderLogo}
                style={{ width: "25%" }}
              />
            )}
          </div>

          <div className="row mt-4">
            <BuilderImage />
          </div>

          <BuilderSeo />

          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              {isBuilderEditable ? "EDIT" : "SAVE"}
            </button>

            <button type="button" className="cancel-btn">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBuilder;
