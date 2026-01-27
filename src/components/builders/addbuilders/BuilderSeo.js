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
   builder, setBuilder
  } = GpState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());
  const handleInputChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;
    setBuilder((prevProjects) => {
      const updatedProjects = { ...prevProjects };
      if (subSection) {
        updatedProjects[section][subSection][name] = type === 'checkbox' ? checked : value;
      } else {
        updatedProjects[section][name] = type === 'checkbox' ? checked : value;
      }
      if (section === 'seo' && name === 'index') {
        updatedProjects[section].robots = checked ? 'index, follow' : 'noindex, nofollow';
      }
      return updatedProjects;
    });
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const onEditorStateChange2 = (editorState) => {
    setEditorState2(editorState);
  };
  const handlePastedText2 = (text, html, editorState) => {
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

  const handlePastedText = (text, html, editorState) => {
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

  return (
    <>
    <div className="row mt-5">
    <h4 className="property_form_h4">About Builder</h4>
        <div className="col-md-12">
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
      <div className="row mt-5">
        <h4 className="property_form_h4">SEO Details</h4>
        <div className="col-md-6">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Title"
              name="title"
              value={builder.seo.title}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label htmlFor="floatingInput">Title</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Keywords"
              name="keywords"
              value={builder.seo.keywords}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label htmlFor="floatingInput">Keywords</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Description"
              name="description"
              value={builder.seo.description}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label htmlFor="floatingInput">Description</label>
          </div>
        </div>
      </div>

      <div className="row my-2">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputTwitter"
              placeholder="Twitter title"
              name="title"
              value={builder.seo?.twitter?.title}
              onChange={(e) => handleInputChange(e, 'seo', 'twitter')}
            />
            <label htmlFor="floatingInputTwitter">Twitter Title</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputTwitDesc"
              name="description"
              placeholder="Twitter Description"
              value={builder.seo.twitter.description}
              onChange={(e) => handleInputChange(e, 'seo', 'twitter')}
            />
            <label htmlFor="floatingInputTwitDesc">Twitter Description</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputOgTitle"
              placeholder="Open Graph Title"
              name="title"
              value={builder.seo.open_graph.title}
              onChange={(e) => handleInputChange(e, 'seo', 'open_graph')}
            />
            <label htmlFor="floatingInputOgTitle">Open Graph Title</label>
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="form-floating border_field">
            <textarea
              type="text"
              className="form-control"
              id="floatingInputOgDesc"
              placeholder="Open Graph Description"
              name="description"
              value={builder.seo.open_graph.description}
              onChange={(e) => handleInputChange(e, 'seo', 'open_graph')}
            />
            <label htmlFor="floatingInputOgDesc">Open Graph Description</label>
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
              checked={builder.seo.index}
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Check for indexing this Page
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <h4 className="property_form_h4">Footer Details</h4>
        <div className="col-md-12">
          <div className="form-floating border_field">
            <input
              type="text"
              className="form-control"
              id="floatingInputTwitter"
              placeholder="Footer Title"
              value={builder.seo.footer_title}
              name="footer_title"
              onChange={(e) => handleInputChange(e, 'seo')}
            />
            <label htmlFor="floatingInputTwitter">Footer Title</label>
          </div>
        </div>
      </div>
      <h6 className="mt-4">Footer description</h6>
      <div className="row">
        <div className="col-md-12">
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
    </>
  );
};

export default BuilderSeo;
