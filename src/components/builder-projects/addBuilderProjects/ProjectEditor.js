import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { GpState } from "../../../context/context";

const ProjectEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(() => EditorState.createEmpty());
  const [editorState3, setEditorState3] = useState(() => EditorState.createEmpty());
  const [editorState4, setEditorState4] = useState(() => EditorState.createEmpty());
  const [editorState5, setEditorState5] = useState(() => EditorState.createEmpty());
  const { editProject, isEditable, setProjects, projects } = GpState();

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
          case 'editorState2':
            setEditorState2(initialEditorState);
            break;
          case 'editorState3':
            setEditorState3(initialEditorState);
            break;
          case 'editorState4':
            setEditorState4(initialEditorState);
            break;
          case 'editorState5':
            setEditorState5(initialEditorState);
            break;
          default:
            break;
        }
      } else {
        switch (key) {
          case 'editorState':
            setEditorState(EditorState.createEmpty());
            break;
          case 'editorState2':
            setEditorState2(EditorState.createEmpty());
            break;
          case 'editorState3':
            setEditorState3(EditorState.createEmpty());
            break;
            case 'editorState4':
            setEditorState4(EditorState.createEmpty());
            break;
            case 'editorState5':
            setEditorState5(EditorState.createEmpty());
            break;
          default:
            break;
        }
      }
    };
    updateEditorState('editorState', editProject?.description);
    updateEditorState('editorState2', editProject?.highlights);
    updateEditorState('editorState3', editProject?.advantages);
    updateEditorState('editorState4', editProject?.features);
    updateEditorState('editorState5', editProject?.banner_bullets);
  }, [isEditable]);

  useEffect(() => {
    if (editorState) {
      setProjects((prev) => ({
        ...prev,
        description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      }));
    }
    if (editorState2) {
      setProjects((prev) => ({
        ...prev,
        highlights: draftToHtml(convertToRaw(editorState2.getCurrentContent())),
      }));
    }
    if (editorState3) {
      setProjects((prev) => ({
        ...prev,
        advantages: draftToHtml(convertToRaw(editorState3.getCurrentContent())),
      }));
    }
    if (editorState4) {
      setProjects((prev) => ({
        ...prev,
        features: draftToHtml(convertToRaw(editorState4.getCurrentContent())),
      }));
    }
    if (editorState5) {
      setProjects((prev) => ({
        ...prev,
        banner_bullets: draftToHtml(convertToRaw(editorState5.getCurrentContent())),
      }));
    }
  }, [editorState, editorState2, editorState3, editorState4, editorState5]);

  const url = window.location.href

  return (
    <>
      <div className="row top-margin">
        <div className="col-md-12">
          <h4 className="property_form_h4">About Project</h4>
        </div>
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
      <div className="row top-margin">
        <div className="col-md-12">
          <h4 className="property_form_h4">Project Highlights, Feature and Amenities</h4>
        </div>
        <div className="col-md-12">
          <Editor
            editorState={editorState2}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            handlePastedText={(text) => handlePastedText(text, editorState2, setEditorState2)}
            onEditorStateChange={setEditorState2}
          />
        </div>
      </div>
      <div className="row top-margin">
        <div className="col-md-12">
          <h4 className="property_form_h4">Project Advantages</h4>
        </div>
        <div className="col-md-12">
          <Editor
            editorState={editorState3}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            handlePastedText={(text) => handlePastedText(text, editorState3, setEditorState3)}
            onEditorStateChange={setEditorState3}
          />
        </div>
      </div>
      {/* <div className="row top-margin">
        <div className="col-md-12">
          <h4 className="property_form_h4">Feature & Amenities</h4>
        </div>
        <div className="col-md-12">
          <Editor
            editorState={editorState4}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            handlePastedText={(text) => handlePastedText(text, editorState4, setEditorState4)}
            onEditorStateChange={setEditorState4}
          />
        </div>
      </div> */}
      {url.includes("dwarkaexpressway") && <div className="row top-margin">
        <div className="col-md-12">
          <h4 className="property_form_h4">Banner Bullets</h4>
        </div>
        <div className="col-md-12">
          <Editor
            editorState={editorState5}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            handlePastedText={(text) => handlePastedText(text, editorState5, setEditorState5)}
            onEditorStateChange={setEditorState5}
          />
        </div>
      </div>}
    </>
  );
};

export default ProjectEditor;
