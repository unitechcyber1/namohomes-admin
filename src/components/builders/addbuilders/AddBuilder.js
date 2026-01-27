import React, { useEffect, useState } from "react";
import BuilderDetail from "./BuilderDetail";
import Mainpanelnav from "../../mainpanel-header/Mainpanelnav";
import BuilderSeo from "./BuilderSeo";
import ImageUpload from "../../../ImageUpload";
import BuilderImage from "./BuilderImage";
import { uploadFile } from "../../../services/Services";
import Select from "react-select";
import { getCity, getbuildersDataById } from "../BuilderService";
import BASE_URL from "../../../apiConfig";
import { useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GpState } from "../../../context/context"; 
import Loader from "../../loader/Loader";
import { builders } from "../../../models/builderModel";
const AddBuilder = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [images, setImages] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
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

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const onChangeOptionHandler = (selectedOption, dropdownIdentifier) => {
    switch (dropdownIdentifier) {
      case "city":
        setSelectedCity(selectedOption);
        break;
      default:
        break;
    }
  };
  const cityOptions = cities?.map((city) => ({
    value: city._id,
    label: city.name,
  }));
  useEffect(() => {
    const initialCity = cityOptions.filter((option) =>
      editBuilder?.cities?.includes(option.value)
    );
    if (initialCity && isBuilderEditable) {
      setSelectedCity(initialCity);
    } else {
      setSelectedCity(null);
    }
  }, [cities]);
  const handleUploadFile = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, previewFile);
  };
  const previewFile = (data) => {
    const allimages = images;
    setImages(allimages.concat(data));
  };

  const handleFetchCity = async () => {
    await getCity(setCities);
  };
  const handleFetchBuilderById = async () => {
    setLoading(true);
    setIsBuilderEditable(true);
    const data = await getbuildersDataById(id);
    setEditBuilder(data);
    setLoading(false);
  };  
  const allCity = selectedCity?.map((city) => city.value);
  const allData = {
    ...builder,
    description: footer_des,
    about_builder: aboutEditor,
    images: builderImage,
    BuilderLogo: images[0],
    cities: allCity,
  };
  
  const handleSaveBuilder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/api/admin/builder`, allData);
      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleUpdateBuilder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/admin/builder/edit-builder/${id}`,
        allData
      );
      toast({
        title: "Update Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to update the results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    handleFetchCity();
    if (id) {
      handleFetchBuilderById();
    } else {
      setEditBuilder({});
      setIsBuilderEditable(false);
    }
  }, []);
  useEffect(() => {
    if (editBuilder && isBuilderEditable) {
      setBuilder({...editBuilder})
    }
    else{
      setBuilder(builders);
    }
  }, [editBuilder]);
  if (loading && isBuilderEditable) {
    return <Loader />;
  }
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form
          style={{ textAlign: "left" }}
          onSubmit={isBuilderEditable ? handleUpdateBuilder : handleSaveBuilder}
        >
          <div className="container">
            <div className="row mt-4">
              <BuilderDetail />
            </div>
            <div className="row mt-4">
              <h5 style={{ marginTop: "25px" }}>Select City</h5>
              <div className="col-md-6">
                <div
                  style={{
                    borderBottom: "1px solid #cccccc",
                  }}
                >
                  <Select
                    placeholder="City"
                    value={selectedCity}
                    options={cityOptions}
                    onChange={(selectedOption) =>
                      onChangeOptionHandler(selectedOption, "city")
                    }
                    isMulti
                    isSearchable
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <h5 style={{ marginTop: "25px" }}>Builder Logo</h5>
                <ImageUpload
                  images={images}
                  setImages={setImages}
                  progress={progress}
                  setProgress={setProgress}
                  uploadFile={handleUploadFile}
                  isUploaded={isUploaded}
                />
              </div>
              <img src={editBuilder?.BuilderLogo} style={{ width: "25%" }} />
            </div>
            <div className="row mt-4">
              <BuilderImage />
            </div>
            <BuilderSeo />
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              {isBuilderEditable ? "EDIT" : "SAVE"}
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBuilder;
