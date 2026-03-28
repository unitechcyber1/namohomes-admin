import React, { useEffect, useState } from "react";
import BuilderDetail from "./BuilderDetail";
import BuilderSeo from "./BuilderSeo";
import BuilderImage from "./BuilderImage";
import ImageUpload from "../../../ImageUpload";

import Select from "react-select";
import { useToast } from "@chakra-ui/react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { uploadFile } from "../../../services/Services";
import { GpState } from "../../../context/context";
import Loader from "../../loader/Loader";

import { getCities } from "../../../services/cityService";
import {
  getBuilderById,
  createBuilder,
  updateBuilder,
} from "../../../services/builderService";

import { builders as builderModel } from "../../../models/builderModel";

import "./AddBuilder.css";

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: 40,
    borderRadius: "0.75rem",
    borderColor: "rgb(226 232 240)",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": { borderColor: "rgb(203 213 225)" },
  }),
  menu: (base) => ({ ...base, borderRadius: "0.75rem", overflow: "hidden" }),
};

const FORM_ID = "add-builder-form";

const AddBuilder = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    builder,
    builderImage,
    setBuilderImage,
    footer_des,
    editBuilder,
    setEditBuilder,
    isBuilderEditable,
    setIsBuilderEditable,
    aboutEditor,
    setBuilder,
  } = GpState();

  const [images, setImages] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const previewFile = (data) => {
    setImages((prev) => prev.concat(data));
  };

  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };

  const fetchCities = async () => {
    try {
      const data = await getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "City load failed", status: "error" });
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Load / reset when route changes (add vs edit, or switching between builder ids).
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setImages([]);
      setProgress(0);
      setIsUploaded(false);

      if (!id) {
        setEditBuilder({});
        setIsBuilderEditable(false);
        setBuilderImage([]);
        setBuilder(builderModel);
        setSelectedCity(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setIsBuilderEditable(true);
        const data = await getBuilderById(id);
        if (!cancelled) {
          setEditBuilder(data);
        }
      } catch {
        if (!cancelled) {
          toast({ title: "Builder load failed", status: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Sync form model from loaded record — only when we have a real document (avoid {} overwriting defaults).
  useEffect(() => {
    if (!isBuilderEditable) {
      setBuilder(builderModel);
      return;
    }
    if (editBuilder?._id) {
      setBuilder({ ...editBuilder });
    }
  }, [editBuilder, isBuilderEditable]);

  const cityOptions = cities.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  useEffect(() => {
    if (!isBuilderEditable) return;

    const selected = cityOptions.filter((opt) =>
      editBuilder?.cities?.includes(opt.value)
    );

    setSelectedCity(selected);
  }, [cities, editBuilder]);

  const allCityIds = selectedCity?.map((c) => c.value);

  // New logo upload uses `images[0]`; otherwise keep existing URL from loaded builder (avoid wiping on edit).
  const builderLogoPayload =
    images?.length > 0 ? images[0] : builder?.BuilderLogo ?? editBuilder?.BuilderLogo;

  const payload = {
    ...builder,
    description: footer_des,
    about_builder: aboutEditor,
    images: builderImage,
    BuilderLogo: builderLogoPayload,
    cities: allCityIds,
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await createBuilder(payload);

      toast({
        title: "Saved Successfully!",
        status: "success",
      });

      navigate("/builder");
    } catch (e) {
      toast({
        title: "Save failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateBuilder(id, payload);

      toast({
        title: "Updated Successfully!",
        status: "success",
      });

      navigate("/builder");
    } catch (e) {
      toast({
        title: "Update failed",
        description: e.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/builder");
  };

  if (loading && isBuilderEditable) return <Loader />;

  return (
    <div className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {isBuilderEditable ? "Edit builder" : "Add builder"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Basic details, cities, logo, gallery, and SEO for this builder.
            </p>
          </div>
          <Link
            to="/builder"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to builders
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <form
            id={FORM_ID}
            className="p-4 sm:p-6"
            onSubmit={isBuilderEditable ? handleUpdate : handleSave}
          >
            <div className="space-y-6">
              <BuilderDetail />

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Cities</div>
                    <div className="saas-card-subtitle">
                      Select all cities where this builder is active.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body">
                  <label className="saas-label" htmlFor="builder-cities-select">
                    Cities
                  </label>
                  <Select
                    inputId="builder-cities-select"
                    value={selectedCity}
                    options={cityOptions}
                    onChange={setSelectedCity}
                    isMulti
                    isSearchable
                    styles={selectStyles}
                    placeholder="Search and select cities…"
                    required
                  />
                </div>
              </div>

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Builder logo</div>
                    <div className="saas-card-subtitle">
                      Primary logo used in listings and the profile header.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
                    <div>
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
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-medium text-slate-500">
                          Current logo
                        </p>
                        <img
                          src={editBuilder.BuilderLogo}
                          alt="Builder logo"
                          className="max-h-40 w-auto max-w-full rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <BuilderImage />

              <BuilderSeo />
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleCancel}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="h-10 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
          >
            {isBuilderEditable ? "Update builder" : "Save builder"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBuilder;
