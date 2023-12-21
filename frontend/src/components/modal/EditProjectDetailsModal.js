import Select from "react-select";
import { useState, useEffect } from "react";
import { jobOptions } from "../../constants/constants";
import ErrorMessage from "../../components/ErrorMessage";
import { checkValidity } from "../../validate";
import { editProject } from "../../actions/projectActions";
import { useDispatch } from "react-redux"
const EditProjectDetailsModal = ({
  showEditProjectModal,
  onCloseEditProjectModal,
  titlePrj,
  domainPrj,
  descriptionPrj,
  token,id
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(titlePrj);
  const [description, setDescription] = useState(descriptionPrj);
  const [domain, setDomain] = useState({ label: "", value: "" });
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
    domain: {
      validation: {
        required: {
          errorText: "Please provide a domain",
        },
      },
      valid: true,
      errorText: "",
    },
  });
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
    const isDomainValid = await validateControl("domain", domain.value);
    const isTitleValid = await validateControl("title", title);
    return isDomainValid && isTitleValid;
  };

  const handleEdit = async(e) => {
    e.preventDefault();
    let resultValid = await validateForm();
    if (!resultValid) return;
    dispatch(editProject(title,description,domain.value,token,id));
    onCloseEditProjectModal();
  };

  useEffect(() => {
    setTitle(titlePrj);
    setDescription(descriptionPrj);
    setDomain({ label:domainPrj, value:domainPrj });
    setControls({
      ...controls,
      domain: { ...controls.domain, valid: true, errorText: "" },
      title: { ...controls.title, valid: true, errorText: "" },
    });
  }, [onCloseEditProjectModal]);
  if (!showEditProjectModal) return null;
  return (
    <div className="modal-create-project">
      <div className="modal-create-project-content">
        <h2>Edit your project's details</h2>
        <div className="title-section">
          <label>Project title</label>
          <div>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
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
              name="domain"
              defaultValue={{ label: domainPrj, value: domainPrj }}
              value={domain}
              onChange={setDomain}
              options={jobOptions}
              className="domain-dropdown"
            />
            {controls.domain.errorText && (
              <ErrorMessage errorMessage={controls.domain.errorText} />
            )}
          </div>
        </div>
        <div className="description-section">
          <label>Project description</label>
          <textarea
            name="description"
            value={description}
            placeholder="Write a description"
            rows="4"
            cols="10"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="button-section">
          <button
            onClick={onCloseEditProjectModal}
            className="cancel-button-modal"
          >
            Cancel
          </button>
          <button className="save-button-modal" onClick={handleEdit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDetailsModal;
