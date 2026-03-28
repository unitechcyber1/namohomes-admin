import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { GpState } from "../../../context/context";
import htmlToDraft from "html-to-draftjs";

const BuilderSeo = () => {
  const {
    editBuilder,
    isBuilderEditable,
    setFooter_des,
    SetAboutEditor,
    builder,
    setBuilder,
  } = GpState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());

  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;
    setBuilder((prevProjects) => {
      const updatedProjects = { ...prevProjects };
      if (subSection) {
        updatedProjects[section][subSection][name] =
          type === "checkbox" ? checked : value;
      } else {
        updatedProjects[section][name] = type === "checkbox" ? checked : value;
      }
      if (section === "seo" && name === "index") {
        updatedProjects[section].robots = checked
          ? "index, follow"
          : "noindex, nofollow";
      }
      return updatedProjects;
    });
  };

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };
  const onEditorStateChange2 = (state) => {
    setEditorState2(state);
  };

  const handlePastedText2 = (text, html, edState) => {
    const plainText = text.replace(/(<([^>]+)>)/gi, "");
    const contentState = ContentState.createFromText(plainText);
    const newContentState = Modifier.replaceWithFragment(
      edState.getCurrentContent(),
      edState.getSelection(),
      contentState.getBlockMap()
    );
    const newEditorState = EditorState.push(
      edState,
      newContentState,
      "insert-fragment"
    );
    setEditorState2(newEditorState);
  };

  useEffect(() => {
    if (editBuilder?.description && isBuilderEditable) {
      const blocks = htmlToDraft(editBuilder?.description || "empty");
      const { contentBlocks, entityMap } = blocks;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const initialEditorState = EditorState.createWithContent(contentState);
      setEditorState(initialEditorState);
    } else {
      setEditorState(() => EditorState.createEmpty());
    }
  }, [editBuilder]);

  useEffect(() => {
    if (editBuilder?.about_builder && isBuilderEditable) {
      const blocks = htmlToDraft(editBuilder?.about_builder || "empty");
      const { contentBlocks, entityMap } = blocks;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const initialEditorState = EditorState.createWithContent(contentState);
      setEditorState2(initialEditorState);
    } else {
      setEditorState2(() => EditorState.createEmpty());
    }
  }, [editBuilder?.about_builder]);

  useEffect(() => {
    if (editorState) {
      setFooter_des(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }
    if (editorState2) {
      SetAboutEditor(draftToHtml(convertToRaw(editorState2.getCurrentContent())));
    }
  }, [editorState, editorState2]);

  const handlePastedText = (text, html, edState) => {
    const plainText = text.replace(/(<([^>]+)>)/gi, "");
    const contentState = ContentState.createFromText(plainText);
    const newContentState = Modifier.replaceWithFragment(
      edState.getCurrentContent(),
      edState.getSelection(),
      contentState.getBlockMap()
    );
    const newEditorState = EditorState.push(
      edState,
      newContentState,
      "insert-fragment"
    );
    setEditorState(newEditorState);
  };

  const seo = builder?.seo;

  return (
    <>
      <div className="saas-card">
        <div className="saas-card-header">
          <div>
            <div className="saas-card-title">About builder</div>
            <div className="saas-card-subtitle">
              Long-form content for the builder profile page.
            </div>
          </div>
        </div>
        <div className="saas-card-body">
          <div className="add-builder-editor">
            <Editor
              editorState={editorState2}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              handlePastedText={handlePastedText2}
              onEditorStateChange={onEditorStateChange2}
            />
          </div>
        </div>
      </div>

      <div className="saas-card">
        <div className="saas-card-header">
          <div>
            <div className="saas-card-title">SEO &amp; social</div>
            <div className="saas-card-subtitle">
              Meta tags, Twitter, and Open Graph for search and sharing.
            </div>
          </div>
        </div>
        <div className="saas-card-body space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control"
                id="builder-seo-title"
                placeholder="Title"
                name="title"
                value={seo?.title ?? ""}
                onChange={(e) => handleInputChange(e, "seo")}
              />
              <label htmlFor="builder-seo-title">Meta title</label>
            </div>
          </div>
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-seo-keywords"
              placeholder="Keywords"
              name="keywords"
              value={seo?.keywords ?? ""}
              onChange={(e) => handleInputChange(e, "seo")}
            />
            <label htmlFor="builder-seo-keywords">Keywords</label>
          </div>
          <div className="form-floating border_field">
            <textarea
              className="form-control"
              style={{ minHeight: "88px" }}
              id="builder-seo-description"
              placeholder="Description"
              name="description"
              value={seo?.description ?? ""}
              onChange={(e) => handleInputChange(e, "seo")}
            />
            <label htmlFor="builder-seo-description">Meta description</label>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Twitter
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="form-floating border_field">
                <input
                  type="text"
                  className="form-control"
                  id="builder-twitter-title"
                  placeholder="Twitter title"
                  name="title"
                  value={seo?.twitter?.title ?? ""}
                  onChange={(e) => handleInputChange(e, "seo", "twitter")}
                />
                <label htmlFor="builder-twitter-title">Twitter title</label>
              </div>
            </div>
            <div className="form-floating border_field mt-4">
              <textarea
                className="form-control"
                style={{ minHeight: "80px" }}
                id="builder-twitter-desc"
                name="description"
                placeholder="Twitter description"
                value={seo?.twitter?.description ?? ""}
                onChange={(e) => handleInputChange(e, "seo", "twitter")}
              />
              <label htmlFor="builder-twitter-desc">Twitter description</label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Open Graph
            </p>
            <div className="form-floating border_field">
              <input
                type="text"
                className="form-control"
                id="builder-og-title"
                placeholder="Open Graph title"
                name="title"
                value={seo?.open_graph?.title ?? ""}
                onChange={(e) => handleInputChange(e, "seo", "open_graph")}
              />
              <label htmlFor="builder-og-title">Open Graph title</label>
            </div>
            <div className="form-floating border_field mt-4">
              <textarea
                className="form-control"
                style={{ minHeight: "80px" }}
                id="builder-og-desc"
                placeholder="Open Graph description"
                name="description"
                value={seo?.open_graph?.description ?? ""}
                onChange={(e) => handleInputChange(e, "seo", "open_graph")}
              />
              <label htmlFor="builder-og-desc">Open Graph description</label>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <input
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500/40"
              type="checkbox"
              id="builder-seo-index"
              name="index"
              checked={!!seo?.index}
              onChange={(e) => handleInputChange(e, "seo")}
            />
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="builder-seo-index"
            >
              Allow search engines to index this page
            </label>
          </div>
        </div>
      </div>

      <div className="saas-card">
        <div className="saas-card-header">
          <div>
            <div className="saas-card-title">Footer content</div>
            <div className="saas-card-subtitle">
              Footer title and description blocks.
            </div>
          </div>
        </div>
        <div className="saas-card-body space-y-4">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="builder-footer-title"
              placeholder="Footer title"
              value={seo?.footer_title ?? ""}
              name="footer_title"
              onChange={(e) => handleInputChange(e, "seo")}
            />
            <label htmlFor="builder-footer-title">Footer title</label>
          </div>
          <div>
            <label className="saas-label">Footer description</label>
            <div className="add-builder-editor mt-2">
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                handlePastedText={handlePastedText}
                onEditorStateChange={onEditorStateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuilderSeo;
