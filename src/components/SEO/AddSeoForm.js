import React, { useEffect, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier,
} from "draft-js";

import { useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { seoModel } from "../../models/seoModel";
import Loader from "../loader/Loader";

import {
  getSeoById,
  createSeo,
  updateSeo,
} from "services/seoService";

function AddSeoForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const isDwarka = window.location.href.includes("dwarkaexpressway");
  const seoType = isDwarka ? "dwarka" : "default";
  const baseSeoPath = isDwarka ? "/dwarkaexpressway/seo" : "/seo";

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [seo, setSeo] = useState(seoModel);
  const [editSeo, setEditSeo] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- INPUT HANDLER ----------
  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;

    setSeo((prev) => {
      const updated = { ...prev };

      if (subSection) {
        updated[section][subSection][name] =
          type === "checkbox" ? checked : value;
      } else if (section) {
        updated[section][name] =
          type === "checkbox" ? checked : value;
      } else {
        updated[name] = type === "checkbox" ? checked : value;
      }

      if (name === "index") {
        updated.robots = checked
          ? "index, follow"
          : "noindex, nofollow";
      }

      return updated;
    });
  };

  // ---------- PASTE CLEAN ----------
  const handlePastedText = (text, editorState) => {
    const plainText = text.replace(/(<([^>]+)>)/gi, "");
    const contentState = ContentState.createFromText(plainText);

    const newContent = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      contentState.getBlockMap()
    );

    setEditorState(
      EditorState.push(editorState, newContent, "insert-fragment")
    );
  };

  // ---------- SYNC EDITOR HTML ----------
  useEffect(() => {
    setSeo((prev) => ({
      ...prev,
      footer_description: draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      ),
    }));
  }, [editorState]);

  // ---------- FETCH SEO BY ID ----------
  const fetchSeoById = async () => {
    try {
      setLoading(true);
      setIsEditable(true);
      const data = await getSeoById(id);
      setEditSeo(data);
    } catch {
      toast({ title: "Failed to load SEO", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSeoById();
    else {
      setEditSeo({});
      setIsEditable(false);
    }
  }, [id]);

  // ---------- LOAD FORM ----------
  useEffect(() => {
    if (isEditable && editSeo) setSeo({ ...editSeo });
    else setSeo({ ...seoModel });
  }, [editSeo]);

  // ---------- LOAD EDITOR CONTENT ----------
  useEffect(() => {
    if (editSeo?.footer_description && isEditable) {
      const blocks = htmlToDraft(editSeo.footer_description);
      const content = ContentState.createFromBlockArray(
        blocks.contentBlocks,
        blocks.entityMap
      );
      setEditorState(EditorState.createWithContent(content));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [editSeo]);

  // ---------- SAVE ----------
  const handleSaveSeo = async (e) => {
    e.preventDefault();
    try {
      if (isEditable) {
        await updateSeo({ id, payload: seo });
      } else {
        await createSeo({ payload: seo });
      }

      toast({
        title: isEditable ? "Updated Successfully!" : "Saved Successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      if (!isEditable) navigate(baseSeoPath);

    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message,
        status: "error",
      });
    }
  };

  if (loading) return <Loader />;

  // ---------- UI ----------
  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />

      <div className="container form-box">
        <form onSubmit={handleSaveSeo}>

          {/* Heading */}
          <div className="form-floating border_field">
            <input className="form-control" name="page_title"
              value={seo.page_title} onChange={handleInputChange} />
            <label>Heading</label>
          </div>

          {/* Header Description */}
          <div className="form-floating border_field mt-3">
            <input className="form-control" name="header_description"
              value={seo.header_description} onChange={handleInputChange} />
            <label>Header Description</label>
          </div>

          {/* Keywords */}
          <div className="form-floating border_field mt-3">
            <input className="form-control" name="keywords"
              value={seo.keywords} onChange={handleInputChange} />
            <label>Keywords</label>
          </div>

          {/* Path */}
          <div className="form-floating border_field mt-3">
            <input className="form-control" name="path" required
              value={seo.path} onChange={handleInputChange} />
            <label>Path</label>
          </div>

          {/* Meta Title */}
          <div className="form-floating border_field mt-3">
            <input className="form-control" name="title" required
              value={seo.title} onChange={handleInputChange} />
            <label>Meta Title</label>
          </div>

          {/* Meta Description */}
          <div className="form-floating border_field mt-3">
            <textarea className="form-control" name="description" required
              value={seo.description} onChange={handleInputChange} />
            <label>Description</label>
          </div>

          {/* Twitter */}
          <div className="form-floating border_field mt-3">
            <input className="form-control"
              name="title"
              value={seo.twitter?.title}
              onChange={(e) => handleInputChange(e, "twitter")} />
            <label>Twitter Title</label>
          </div>

          <div className="form-floating border_field mt-3">
            <textarea className="form-control"
              name="description"
              value={seo.twitter?.description}
              onChange={(e) => handleInputChange(e, "twitter")} />
            <label>Twitter Description</label>
          </div>

          {/* Open Graph */}
          <div className="form-floating border_field mt-3">
            <input className="form-control"
              name="title"
              value={seo.open_graph?.title}
              onChange={(e) => handleInputChange(e, "open_graph")} />
            <label>Open Graph Title</label>
          </div>

          <div className="form-floating border_field mt-3">
            <textarea className="form-control"
              name="description"
              value={seo.open_graph?.description}
              onChange={(e) => handleInputChange(e, "open_graph")} />
            <label>Open Graph Description</label>
          </div>

          {/* Script */}
          <div className="form-floating border_field mt-3">
            <textarea className="form-control" name="script"
              value={seo.script} onChange={handleInputChange} />
            <label>Script tag</label>
          </div>

          {/* Index Checkbox */}
          <div className="form-check mt-3">
            <input type="checkbox" className="form-check-input"
              name="index" checked={seo.index}
              onChange={handleInputChange} />
            <label className="form-check-label">
              Check for indexing this Page
            </label>
          </div>

          {/* Footer Title */}
          <div className="form-floating border_field mt-3">
            <input className="form-control" name="footer_title"
              value={seo.footer_title} onChange={handleInputChange} />
            <label>Footer Title</label>
          </div>

          {/* Footer Editor */}
          <h6 className="mt-4">Footer description</h6>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            handlePastedText={(t) => handlePastedText(t, editorState)}
          />

          {/* Buttons */}
          <div className="form-footer mt-4">
            <button type="submit" className="saveproperty-btn">
              Save
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(baseSeoPath)}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddSeoForm;
