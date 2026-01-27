import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import axios from "axios";
import { useDisclosure, Spinner, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import draftToHtml from "draftjs-to-html";
import { seoModel } from "../../models/seoModel";
import { getSeoDataById } from "./SeoService";
import Loader from "../loader/Loader";
import htmlToDraft from "html-to-draftjs";
function AddSeoForm() {
  const toast = useToast();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [seo, setSeo] = useState(seoModel);
  const [editSeo, setEditSeo] = useState({})
  const [isEditable, setIsEditable] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = window.location.href;
  const { id } = useParams()
  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;
    setSeo((prev) => {
      const updatedSeo = { ...prev };
      if (subSection) {
        updatedSeo[section][subSection][name] = type === 'checkbox' ? checked : value;
      } else if (section) {
        updatedSeo[section][name] = type === 'checkbox' ? checked : value;
      }
      else {
        updatedSeo[name] = type === 'checkbox' ? checked : value;
      }
      if (name === 'index') {
        updatedSeo.robots = checked ? 'index, follow' : 'noindex, nofollow';
      }
      return updatedSeo;
    });
  };
  const handlePastedText = (text, editorState, setEditorState) => {
    const plainText = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    const contentState = ContentState.createFromText(plainText);
    const newContentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      contentState.getBlockMap()
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-fragment"
    );
    setEditorState(newEditorState);
  };
  useEffect(() => {
    if (editorState) {
      setSeo((prev) => ({
        ...prev,
        footer_description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      }));
    }
  }, [editorState]);
  const handleFetchSeobyId = async () => {
    setLoading(true)
    setIsEditable(true);
    const data = await getSeoDataById(id, url);
    setEditSeo(data)
    setLoading(false)
  };
  useEffect(() => {
    if (id) {
      handleFetchSeobyId();
    } else {
      setEditSeo({});
      setIsEditable(false);
    }
  }, [id]);
  useEffect(() => {
    if (editSeo && isEditable) {
      setSeo({ ...editSeo })
    }
    else {
      setSeo({
        ...seoModel
      });
    }
  }, [editSeo]);
  useEffect(() => {
    const updateEditorState = (key, value) => {
      if (value && isEditable) {
        const blocksFromHtml = htmlToDraft(value);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const initialEditorState = EditorState.createWithContent(contentState);
        switch (key) {
          case 'editorState':
            setEditorState(initialEditorState);
            break;
        }
      } else {
        switch (key) {
          case 'editorState':
            setEditorState(EditorState.createEmpty());
            break;
        }
      }
    };
    updateEditorState('editorState', editSeo?.footer_description);
  }, [editSeo]);
  const handleSaveSeo = async (e) => {
    e.preventDefault();
    try {
      if (isEditable) {
        if (url.includes("dwarkaexpressway")) {
          await axios.put(`${BASE_URL}/api/admin/dwarka/seos/${id}`, seo);
        } else {
          await axios.put(`${BASE_URL}/api/admin/seo/seos/${id}`, seo);
        }
      } else {
        if (url.includes("dwarkaexpressway")) {
          await axios.post(`${BASE_URL}/api/admin/dwarka/seos`, seo);
        } else {
          await axios.post(`${BASE_URL}/api/admin/seo/seos`, seo);
        }
      }
      if (!isEditable) {
        if (url.includes("dwarkaexpressway")) {
          navigate("/dwarkaexpressway/seo");
        } else {
          navigate("/seo");
        }
      }
      toast({
        title: isEditable ? "Update Successfully!" : "Saved Successfully!",
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
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="container form-box">
        <form style={{ textAlign: "left" }} onSubmit={handleSaveSeo}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Main Heading*"
                    name="page_title"
                    onChange={handleInputChange}
                    value={seo?.page_title}
                  />
                  <label htmlFor="floatingInput">Heading</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Header Description*"
                    name="header_description"
                    onChange={handleInputChange}
                    value={seo?.header_description}
                  />
                  <label htmlFor="floatingInput">Header Decription</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Keywords*"
                    name="keywords"
                    onChange={handleInputChange}
                    value={seo?.keywords}
                  />
                  <label htmlFor="floatingInput">Keywords</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Path*"
                    name="path"
                    required
                    onChange={handleInputChange}
                    value={seo?.path}
                  />
                  <label htmlFor="floatingInput">Path*</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Meta Title*(Max Word 60)"
                    required
                    name="title"
                    onChange={handleInputChange}
                    value={seo?.title}
                  />
                  <label htmlFor="floatingInput">
                    Meta Title*(Max Word 60)
                  </label>
                </div>
              </div>{" "}
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Description*(Max Word 160)"
                    required
                    name="description"
                    onChange={handleInputChange}
                    value={seo?.description}
                  />
                  <label htmlFor="floatingInput">
                    Description*(Max Word 160)
                  </label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Twitter title"
                    name="title"
                    onChange={(e) => handleInputChange(e, 'twitter')}
                    value={seo?.twitter?.title}
                  />
                  <label htmlFor="floatingInput">Twitter title</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Twitter description"
                    name="description"
                    onChange={(e) => handleInputChange(e, 'twitter')}
                    value={seo?.twitter?.description}
                  />
                  <label htmlFor="floatingInput">Twitter description</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open graph title"
                    name="title"
                    onChange={(e) => handleInputChange(e, 'open_graph')}
                    value={seo?.open_graph?.title}
                  />
                  <label htmlFor="floatingInput">Open graph title</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Open graph description"
                    name="description"
                    onChange={(e) => handleInputChange(e, 'open_graph')}
                    value={seo?.open_graph?.description}
                  />
                  <label htmlFor="floatingInput">Open graph description</label>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="form-floating border_field">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Script tag*"
                    name="script"
                    onChange={handleInputChange}
                    value={seo.script}
                  />
                  <label htmlFor="floatingInput">Script tag</label>
                </div>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="index"
                    checked={seo?.index}
                    onChange={handleInputChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Check for indexing this Page
                  </label>
                </div>
              </div>
            </div>
            <div className="row mt-2 mb-5">
              <div className="col-md-6">
                <div className="form-floating border_field">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Footer title"
                    name="footer_title"
                    onChange={handleInputChange}
                    value={seo?.footer_title}
                  />
                  <label htmlFor="floatingInput">Footer title</label>
                </div>
              </div>
            </div>
            <h6>Footer description</h6>
            <div className="row mt-4">
              <div className="col-md-12">
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  handlePastedText={(text) => handlePastedText(text, editorState, setEditorState)}
                  onEditorStateChange={setEditorState}
                />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="saveproperty-btn">
              Save
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSeoForm;
