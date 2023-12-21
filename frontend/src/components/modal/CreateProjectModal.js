import Select from "react-select";
import { useState, useEffect } from "react";
import { jobOptions } from "../../constants/constants";
import { useSelector, useDispatch } from "react-redux";
import { checkValidity } from "../../validate";
import axios from "axios";
import "./create-project-modal.scss";
import ErrorMessage from "../ErrorMessage";
import * as actionTypes from "../../actions/types";
import { addProject } from "../../actions/projectActions";

const CreateProjectModal = ({ show, onClose }) => {
  const [projectDomain, setProjectDomain] = useState({ Label: "", value: "" });
  const [title, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [controls, setControls] = useState({
    title: {
      validation: {
        required: {
          errorText: "Please provide a title",
        },
      },
      valid: true,
      errorText: "",
    },
    projectDomain: {
      validation: {
        required: {
          errorText: "Please provide a domain",
        },
      },
      valid: true,
      errorText: "",
    },
  });

  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const dispatch = useDispatch();
  const token = userInfo.userData.token;
  const validateControl = async (name, value) => {
    const validationResult = checkValidity(value, controls[name].validation);
    setControls((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          valid: validationResult.valid,
          errorText: validationResult.valid ? "" : validationResult.error,
        },
      };
    });
    return validationResult.valid;
  };
  const validateForm = async () => {
    const isDomainValid = await validateControl(
      "projectDomain",
      projectDomain.value
    );
    const isTitleValid = await validateControl("title", title);
    return isDomainValid && isTitleValid;
  };
  const handleSave = async (e) => {
    e.preventDefault();
    let resultValid = await validateForm();
    if (!resultValid) return;
    dispatch(addProject(title, projectDomain, description, token));
    onClose();
  };
  useEffect(() => {
    setProjectTitle("");
    setDescription("");
    setProjectDomain({ Label: "", value: "" });
    setControls({
      ...controls,
      projectDomain: { ...controls.projectDomain, valid: true, errorText: "" },
      title: { ...controls.title, valid: true, errorText: "" },
    });
  }, [onClose]);
  if (!show) return null;

  return (
    <div className="modal-create-project">
      <div className="modal-create-project-content">
        <h2>Create a new project</h2>
        <div className="title-section">
          <label>Project title</label>
          <div>
            <input
              type="text"
              id="projectTitle"
              name="projectTitle"
              value={title}
              placeholder="Title"
              onChange={(e) => setProjectTitle(e.target.value)}
            />
            {controls.title.errorText && (
              <ErrorMessage errorMessage={controls.title.errorText} />
            )}
          </div>
        </div>
        <div className="domain-section">
          <label>Please choose a domain:</label>
          <div className="domain-div">
            <Select
              defaultValue={null}
              onChange={setProjectDomain}
              options={jobOptions}
              className="domain-dropdown"
            />
            {controls.projectDomain.errorText && (
              <ErrorMessage errorMessage={controls.projectDomain.errorText} />
            )}
          </div>
        </div>
        <div className="description-section">
          <label>Project description</label>
          <textarea
            name="projectTitle"
            value={description}
            placeholder="Write a description"
            rows="4"
            cols="10"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="button-section">
          <button onClick={onClose} className="cancel-button-modal">
            Cancel
          </button>
          <button className="save-button-modal" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
