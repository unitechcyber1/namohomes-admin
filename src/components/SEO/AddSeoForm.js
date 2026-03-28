import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier,
} from "draft-js";

import { useToast } from "@chakra-ui/react";
import { useNavigate, useParams, Link } from "react-router-dom";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { seoModel } from "../../models/seoModel";
import Loader from "../loader/Loader";

import {
  getSeoById,
  createSeo,
  updateSeo,
} from "../../services/seoService";

import "./AddSeoForm.css";

const FORM_ID = "add-seo-form";
const baseSeoPath = "/seo";

function AddSeoForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [seo, setSeo] = useState(seoModel);
  const [editSeo, setEditSeo] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;

    setSeo((prev) => {
      const updated = { ...prev };

      if (subSection) {
        updated[section][subSection][name] =
          type === "checkbox" ? checked : value;
      } else if (section) {
        updated[section][name] = type === "checkbox" ? checked : value;
      } else {
        updated[name] = type === "checkbox" ? checked : value;
      }

      if (name === "index") {
        updated.robots = checked ? "index, follow" : "noindex, nofollow";
      }

      return updated;
    });
  };

  const handlePastedText = (text, html, edState) => {
    const plainText = text.replace(/(<([^>]+)>)/gi, "");
    const contentState = ContentState.createFromText(plainText);

    const newContent = Modifier.replaceWithFragment(
      edState.getCurrentContent(),
      edState.getSelection(),
      contentState.getBlockMap()
    );

    setEditorState(
      EditorState.push(edState, newContent, "insert-fragment")
    );
  };

  useEffect(() => {
    setSeo((prev) => ({
      ...prev,
      footer_description: draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      ),
    }));
  }, [editorState]);

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
    if (id) {
      fetchSeoById();
    } else {
      setEditSeo({});
      setIsEditable(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditable && editSeo && Object.keys(editSeo).length > 0) {
      setSeo({ ...seoModel, ...editSeo });
    } else if (!isEditable) {
      setSeo({ ...seoModel });
    }
  }, [editSeo, isEditable]);

  useEffect(() => {
    if (editSeo?.footer_description && isEditable) {
      try {
        const blocks = htmlToDraft(editSeo.footer_description);
        const content = ContentState.createFromBlockArray(
          blocks.contentBlocks,
          blocks.entityMap
        );
        setEditorState(EditorState.createWithContent(content));
      } catch {
        setEditorState(EditorState.createEmpty());
      }
    } else if (!isEditable) {
      setEditorState(EditorState.createEmpty());
    }
  }, [editSeo, isEditable]);

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

      navigate(baseSeoPath);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message,
        status: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate(baseSeoPath);
  };

  if (loading) return <Loader />;

  return (
    <div className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {isEditable ? "Edit SEO page" : "Add SEO page"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Page heading, meta tags, social previews, and footer content.
            </p>
          </div>
          <Link
            to={baseSeoPath}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to SEO list
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <form
            id={FORM_ID}
            className="p-4 sm:p-6"
            onSubmit={handleSaveSeo}
          >
            <div className="space-y-6">
              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Page content</div>
                    <div className="saas-card-subtitle">
                      Visible heading, intro text, URL path, and keywords.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="form-floating border_field">
                      <input
                        className="form-control"
                        id="seo-page-title"
                        name="page_title"
                        value={seo.page_title ?? ""}
                        onChange={handleInputChange}
                        placeholder="Heading"
                      />
                      <label htmlFor="seo-page-title">Heading</label>
                    </div>
                    <div className="form-floating border_field">
                      <input
                        className="form-control"
                        id="seo-header-desc"
                        name="header_description"
                        value={seo.header_description ?? ""}
                        onChange={handleInputChange}
                        placeholder="Header description"
                      />
                      <label htmlFor="seo-header-desc">Header description</label>
                    </div>
                  </div>
                  <div className="form-floating border_field">
                    <input
                      className="form-control"
                      id="seo-keywords"
                      name="keywords"
                      value={seo.keywords ?? ""}
                      onChange={handleInputChange}
                      placeholder="Keywords"
                    />
                    <label htmlFor="seo-keywords">Keywords</label>
                  </div>
                  <div className="form-floating border_field">
                    <input
                      className="form-control"
                      id="seo-path"
                      name="path"
                      required
                      value={seo.path ?? ""}
                      onChange={handleInputChange}
                      placeholder="/path"
                    />
                    <label htmlFor="seo-path">Path</label>
                  </div>
                </div>
              </div>

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Meta (search)</div>
                    <div className="saas-card-subtitle">
                      Title and description for search results.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body space-y-4">
                  <div className="form-floating border_field">
                    <input
                      className="form-control"
                      id="seo-meta-title"
                      name="title"
                      required
                      value={seo.title ?? ""}
                      onChange={handleInputChange}
                      placeholder="Meta title"
                    />
                    <label htmlFor="seo-meta-title">Meta title</label>
                  </div>
                  <div className="form-floating border_field">
                    <textarea
                      className="form-control"
                      style={{ minHeight: "100px" }}
                      id="seo-meta-desc"
                      name="description"
                      required
                      value={seo.description ?? ""}
                      onChange={handleInputChange}
                      placeholder="Description"
                    />
                    <label htmlFor="seo-meta-desc">Meta description</label>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500/40"
                      id="seo-index"
                      name="index"
                      checked={!!seo.index}
                      onChange={handleInputChange}
                    />
                    <label
                      className="text-sm font-medium text-slate-700"
                      htmlFor="seo-index"
                    >
                      Allow search engines to index this page
                    </label>
                  </div>
                </div>
              </div>

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Twitter</div>
                    <div className="saas-card-subtitle">
                      Card title and description when shared on X.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body space-y-4">
                  <div className="form-floating border_field">
                    <input
                      className="form-control"
                      id="seo-tw-title"
                      name="title"
                      value={seo.twitter?.title ?? ""}
                      onChange={(e) => handleInputChange(e, "twitter")}
                      placeholder="Twitter title"
                    />
                    <label htmlFor="seo-tw-title">Twitter title</label>
                  </div>
                  <div className="form-floating border_field">
                    <textarea
                      className="form-control"
                      style={{ minHeight: "88px" }}
                      id="seo-tw-desc"
                      name="description"
                      value={seo.twitter?.description ?? ""}
                      onChange={(e) => handleInputChange(e, "twitter")}
                      placeholder="Twitter description"
                    />
                    <label htmlFor="seo-tw-desc">Twitter description</label>
                  </div>
                </div>
              </div>

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Open Graph</div>
                    <div className="saas-card-subtitle">
                      Preview for Facebook, LinkedIn, and similar.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body space-y-4">
                  <div className="form-floating border_field">
                    <input
                      className="form-control"
                      id="seo-og-title"
                      name="title"
                      value={seo.open_graph?.title ?? ""}
                      onChange={(e) => handleInputChange(e, "open_graph")}
                      placeholder="Open Graph title"
                    />
                    <label htmlFor="seo-og-title">Open Graph title</label>
                  </div>
                  <div className="form-floating border_field">
                    <textarea
                      className="form-control"
                      style={{ minHeight: "88px" }}
                      id="seo-og-desc"
                      name="description"
                      value={seo.open_graph?.description ?? ""}
                      onChange={(e) => handleInputChange(e, "open_graph")}
                      placeholder="Open Graph description"
                    />
                    <label htmlFor="seo-og-desc">Open Graph description</label>
                  </div>
                </div>
              </div>

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Scripts</div>
                    <div className="saas-card-subtitle">
                      Optional custom script snippet (use with care).
                    </div>
                  </div>
                </div>
                <div className="saas-card-body">
                  <div className="form-floating border_field">
                    <textarea
                      className="form-control font-mono text-sm"
                      style={{ minHeight: "120px" }}
                      id="seo-script"
                      name="script"
                      value={seo.script ?? ""}
                      onChange={handleInputChange}
                      placeholder="Script tag"
                    />
                    <label htmlFor="seo-script">Script tag</label>
                  </div>
                </div>
              </div>

              <div className="saas-card">
                <div className="saas-card-header">
                  <div>
                    <div className="saas-card-title">Footer</div>
                    <div className="saas-card-subtitle">
                      Footer title and rich description.
                    </div>
                  </div>
                </div>
                <div className="saas-card-body space-y-4">
                  <div className="form-floating border_field">
                    <input
                      className="form-control"
                      id="seo-footer-title"
                      name="footer_title"
                      value={seo.footer_title ?? ""}
                      onChange={handleInputChange}
                      placeholder="Footer title"
                    />
                    <label htmlFor="seo-footer-title">Footer title</label>
                  </div>
                  <div>
                    <span className="saas-label">Footer description</span>
                    <div className="add-seo-editor mt-2" role="presentation">
                      <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        handlePastedText={handlePastedText}
                        onEditorStateChange={setEditorState}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
            {isEditable ? "Update SEO" : "Save SEO"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSeoForm;
